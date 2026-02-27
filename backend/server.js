// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// ============================================
// 📝 LOGGING CONFIGURATION (Winston)
// ============================================

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'sadfood-backend' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs/error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// ============================================
// 🔒 SECURITY CONFIGURATION
// ============================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.sadfood.online"],
      frameSrc: ["'self'", "https://yandex.ru"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://sadfood.online', 'https://www.sadfood.online']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Слишком много запросов, попробуйте позже'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Слишком много запросов, попробуйте позже'
    });
  }
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    error: 'Слишком много попыток входа, попробуйте через 15 минут'
  }
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ============================================
// 🔐 JWT AUTHENTICATION MIDDLEWARE
// ============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Требуется авторизация'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn(`Invalid token: ${err.message}`);
      return res.status(403).json({
        success: false,
        error: 'Неверный токен'
      });
    }
    req.user = user;
    next();
  });
};

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user.email}`);
    return res.status(403).json({
      success: false,
      error: 'Требуется права администратора'
    });
  }
  next();
};

// ============================================
// 📧 EMAIL SERVICE CONFIGURATION
// ============================================

let emailTransporter = null;

const initializeEmailTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('SMTP configuration not found. Email notifications disabled.');
    return null;
  }

  try {
    emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });

    // Verify connection
    emailTransporter.verify((error, success) => {
      if (error) {
        logger.error(`SMTP verification failed: ${error.message}`);
        emailTransporter = null;
      } else {
        logger.info('SMTP server ready to send emails');
      }
    });

    return emailTransporter;
  } catch (error) {
    logger.error(`Failed to initialize email transporter: ${error.message}`);
    return null;
  }
};

// Initialize email transporter on startup
initializeEmailTransporter();

const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  if (!emailTransporter) {
    logger.info('Email sending skipped - transporter not configured');
    return false;
  }

  try {
    const itemsList = order.items.map(item => 
      `${item.name} x${item.quantity} - ${item.price * item.quantity} ₽`
    ).join('\n');

    const mailOptions = {
      from: process.env.SMTP_FROM || `S.A.D. Food <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Заказ #${order.id} подтвержден`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #00ff00; color: #000; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .order-details { background: #fff; padding: 15px; margin: 15px 0; border-radius: 8px; }
              .total { font-size: 24px; font-weight: bold; color: #00ff00; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>S.A.D. FOOD</h1>
                <p>Ваш заказ подтвержден!</p>
              </div>
              <div class="content">
                <p>Здравствуйте, ${customerName || 'Клиент'}!</p>
                <p>Благодарим за заказ. Мы начали его обработку.</p>
                
                <div class="order-details">
                  <h3>Детали заказа #${order.id}</h3>
                  <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                  <p><strong>Адрес доставки:</strong> ${order.deliveryAddress}</p>
                  <p><strong>Способ оплаты:</strong> ${order.paymentMethod === 'card' ? 'Картой' : 'Наличными'}</p>
                  <hr>
                  <h4>Состав заказа:</h4>
                  <pre>${itemsList}</pre>
                  <hr>
                  <p class="total">Итого: ${order.total} ₽</p>
                </div>

                <p>Мы свяжемся с вами в течение 5 минут для подтверждения.</p>
                <p>С уважением, команда S.A.D. Food</p>
                <p>📞 8-920-620-26-26</p>
                <p>📍 г. Кольчугино, ул. 3-го Интернационала, д. 85</p>
              </div>
              <div class="footer">
                <p>© 2024 S.A.D. Food. Все права защищены.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    logger.info(`Order confirmation email sent to: ${customerEmail}`);

    // Send notification to admin
    if (process.env.ADMIN_EMAIL) {
      const adminMailOptions = {
        from: process.env.SMTP_FROM || `S.A.D. Food <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 Новый заказ #${order.id}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .alert { background: #00ff00; color: #000; padding: 15px; border-radius: 8px; }
                .details { background: #f9f9f9; padding: 15px; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="alert">
                  <h2>🔔 Новый заказ #${order.id}</h2>
                </div>
                <div class="details">
                  <p><strong>Клиент:</strong> ${customerName || 'Не указан'}</p>
                  <p><strong>Email:</strong> ${customerEmail}</p>
                  <p><strong>Телефон:</strong> ${order.customerPhone || 'Не указан'}</p>
                  <p><strong>Адрес:</strong> ${order.deliveryAddress}</p>
                  <p><strong>Сумма:</strong> ${order.total} ₽</p>
                  <p><strong>Оплата:</strong> ${order.paymentMethod === 'card' ? 'Картой' : 'Наличными'}</p>
                </div>
              </div>
            </body>
          </html>
        `
      };
      await emailTransporter.sendMail(adminMailOptions);
      logger.info(`Admin notification sent to: ${process.env.ADMIN_EMAIL}`);
    }

    return true;
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    return false;
  }
};

// ============================================
// 🗄️ DATABASE ROUTES - AUTH
// ============================================

// Register new user
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, пароль и имя обязательны'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Некорректный формат email'
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Пароль должен быть не менее 6 символов'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone: phone || null,
        role: 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      data: user
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка регистрации'
    });
  }
});

// Login user
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email и пароль обязательны'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Вход успешен',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка входа'
    });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        addresses: true,
        favorites: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения профиля'
    });
  }
});

// Update user profile
app.put('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true
      }
    });

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Профиль обновлен',
      data: user
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления профиля'
    });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Текущий и новый пароль обязательны'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Новый пароль должен быть не менее 6 символов'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Неверный текущий пароль'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Пароль успешно изменен'
    });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка смены пароля'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - ADDRESSES
// ============================================

// Get user addresses
app.get('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    logger.error(`Get addresses error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения адресов'
    });
  }
});

// Create address
app.post('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const { title, city, street, house, apartment, floor, entrance, intercom } = req.body;

    if (!title || !city || !street || !house) {
      return res.status(400).json({
        success: false,
        error: 'Название, город, улица и дом обязательны'
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.userId,
        title,
        city,
        street,
        house,
        apartment: apartment || null,
        floor: floor || null,
        entrance: entrance || null,
        intercom: intercom || null
      }
    });

    logger.info(`Address created for user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Адрес добавлен',
      data: address
    });
  } catch (error) {
    logger.error(`Create address error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка добавления адреса'
    });
  }
});

// Update address
app.put('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, city, street, house, apartment, floor, entrance, intercom } = req.body;

    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Адрес не найден'
      });
    }

    if (address.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Нет прав для редактирования этого адреса'
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        title: title || address.title,
        city: city || address.city,
        street: street || address.street,
        house: house || address.house,
        apartment: apartment !== undefined ? apartment : address.apartment,
        floor: floor !== undefined ? floor : address.floor,
        entrance: entrance !== undefined ? entrance : address.entrance,
        intercom: intercom !== undefined ? intercom : address.intercom
      }
    });

    logger.info(`Address updated: ${id}`);

    res.json({
      success: true,
      message: 'Адрес обновлен',
      data: updatedAddress
    });
  } catch (error) {
    logger.error(`Update address error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления адреса'
    });
  }
});

// Delete address
app.delete('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Адрес не найден'
      });
    }

    if (address.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Нет прав для удаления этого адреса'
      });
    }

    await prisma.address.delete({
      where: { id }
    });

    logger.info(`Address deleted: ${id}`);

    res.json({
      success: true,
      message: 'Адрес удален'
    });
  } catch (error) {
    logger.error(`Delete address error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка удаления адреса'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - PRODUCTS
// ============================================

// Get all products (with filtering, sorting, pagination)
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      badge, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    if (badge) {
      where.badge = badge;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Get products error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения товаров'
    });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error(`Get product error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения товара'
    });
  }
});

// Create product (admin only)
app.post('/api/products', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, price, image, category, badge, weight, calories, proteins, fats, carbs } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Название, цена и категория обязательны'
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseInt(price),
        image: image || '',
        category,
        badge: badge || null,
        weight: weight || null,
        calories: calories ? parseInt(calories) : null,
        proteins: proteins ? parseFloat(proteins) : null,
        fats: fats ? parseFloat(fats) : null,
        carbs: carbs ? parseFloat(carbs) : null
      }
    });

    logger.info(`Product created: ${product.name} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Товар создан',
      data: product
    });
  } catch (error) {
    logger.error(`Create product error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка создания товара'
    });
  }
});

// Update product (admin only)
app.put('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    const allowedFields = ['name', 'description', 'price', 'image', 'category', 'badge', 'weight', 'calories', 'proteins', 'fats', 'carbs'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['price', 'calories'].includes(field)) {
          updateData[field] = parseInt(req.body[field]);
        } else if (['proteins', 'fats', 'carbs'].includes(field)) {
          updateData[field] = parseFloat(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    logger.info(`Product updated: ${product.name} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Товар обновлен',
      data: product
    });
  } catch (error) {
    logger.error(`Update product error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления товара'
    });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    logger.info(`Product deleted: ${id} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Товар удален'
    });
  } catch (error) {
    logger.error(`Delete product error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка удаления товара'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - CATEGORIES
// ============================================

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error(`Get categories error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения категорий'
    });
  }
});

// Create category (admin only)
app.post('/api/categories', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, slug, icon } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Название и slug обязательны'
      });
    }

    const category = await prisma.category.create({
      data: { name, slug, icon: icon || '' }
    });

    logger.info(`Category created: ${category.name} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Категория создана',
      data: category
    });
  } catch (error) {
    logger.error(`Create category error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка создания категории'
    });
  }
});

// Update category (admin only)
app.put('/api/categories/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        icon: icon !== undefined ? icon : undefined
      }
    });

    logger.info(`Category updated: ${category.name} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Категория обновлена',
      data: category
    });
  } catch (error) {
    logger.error(`Update category error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления категории'
    });
  }
});

// Delete category (admin only)
app.delete('/api/categories/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { category: { id } }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Нельзя удалить категорию с товарами'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    logger.info(`Category deleted: ${id} by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Категория удалена'
    });
  } catch (error) {
    logger.error(`Delete category error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка удаления категории'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - ORDERS
// ============================================

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, customerPhone } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Корзина пуста'
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: 'Адрес доставки обязателен'
      });
    }

    if (!paymentMethod || !['card', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный способ оплаты'
      });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        items: items,
        total,
        deliveryAddress,
        paymentMethod,
        customerPhone: customerPhone || null,
        status: 'processing'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    logger.info(`Order created: ${order.id} by user ${req.user.email}`);

    // Send confirmation email
    await sendOrderConfirmationEmail(
      order, 
      order.user.email, 
      order.user.name
    );

    res.status(201).json({
      success: true,
      message: 'Заказ успешно оформлен',
      data: order
    });
  } catch (error) {
    logger.error(`Create order error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка создания заказа'
    });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Get orders error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения заказов'
    });
  }
});

// Get single order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Заказ не найден'
      });
    }

    // Check ownership or admin
    if (order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Нет прав для просмотра этого заказа'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error(`Get order error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения заказа'
    });
  }
});

// Update order status (admin only)
app.patch('/api/orders/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['processing', 'cooking', 'delivering', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный статус заказа'
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    logger.info(`Order ${id} status updated to ${status} by admin ${req.user.email}`);

    // Send status update email if delivered or cancelled
    if (['delivered', 'cancelled'].includes(status)) {
      await sendOrderConfirmationEmail(
        order,
        order.user.email,
        order.user.name
      );
    }

    res.json({
      success: true,
      message: 'Статус заказа обновлен',
      data: order
    });
  } catch (error) {
    logger.error(`Update order status error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления статуса заказа'
    });
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Get all orders error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения заказов'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - FAVORITES
// ============================================

// Get user favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { favorites: true }
    });

    res.json({
      success: true,
      data: user.favorites || []
    });
  } catch (error) {
    logger.error(`Get favorites error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения избранного'
    });
  }
});

// Toggle favorite
app.post('/api/favorites/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { favorites: true }
    });

    const favorites = user.favorites || [];
    const index = favorites.indexOf(parseInt(productId));

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(parseInt(productId));
    }

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { favorites }
    });

    res.json({
      success: true,
      message: index > -1 ? 'Удалено из избранного' : 'Добавлено в избранное',
      data: favorites
    });
  } catch (error) {
    logger.error(`Toggle favorite error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления избранного'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - DELIVERY SETTINGS
// ============================================

// Get delivery settings
app.get('/api/settings/delivery', async (req, res) => {
  try {
    const settings = await prisma.deliverySettings.findFirst();

    if (!settings) {
      // Create default settings if not exist
      const defaultSettings = await prisma.deliverySettings.create({
        data: {
          freeDeliveryThreshold: 1000,
          deliveryFee: 200,
          estimatedTime: '30-45 мин',
          isDeliveryEnabled: true
        }
      });
      return res.json({
        success: true,
        data: defaultSettings
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error(`Get delivery settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения настроек доставки'
    });
  }
});

// Update delivery settings (admin only)
app.put('/api/settings/delivery', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { freeDeliveryThreshold, deliveryFee, estimatedTime, isDeliveryEnabled } = req.body;

    let settings = await prisma.deliverySettings.findFirst();

    if (!settings) {
      settings = await prisma.deliverySettings.create({
        data: {
          freeDeliveryThreshold: freeDeliveryThreshold ? parseInt(freeDeliveryThreshold) : 1000,
          deliveryFee: deliveryFee ? parseInt(deliveryFee) : 200,
          estimatedTime: estimatedTime || '30-45 мин',
          isDeliveryEnabled: isDeliveryEnabled !== undefined ? isDeliveryEnabled : true
        }
      });
    } else {
      settings = await prisma.deliverySettings.update({
        where: { id: settings.id },
        data: {
          freeDeliveryThreshold: freeDeliveryThreshold ? parseInt(freeDeliveryThreshold) : undefined,
          deliveryFee: deliveryFee ? parseInt(deliveryFee) : undefined,
          estimatedTime: estimatedTime || undefined,
          isDeliveryEnabled: isDeliveryEnabled !== undefined ? isDeliveryEnabled : undefined
        }
      });
    }

    logger.info(`Delivery settings updated by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Настройки доставки обновлены',
      data: settings
    });
  } catch (error) {
    logger.error(`Update delivery settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления настроек доставки'
    });
  }
});

// ============================================
// 🗄️ DATABASE ROUTES - EMAIL SETTINGS
// ============================================

// Get email settings (admin only)
app.get('/api/admin/email-settings', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const settings = await prisma.emailSettings.findFirst();

    if (!settings) {
      return res.json({
        success: true,
        data: {
          adminEmail: process.env.ADMIN_EMAIL || '',
          senderName: 'S.A.D. Food Delivery',
          smtpHost: process.env.SMTP_HOST || '',
          smtpPort: parseInt(process.env.SMTP_PORT) || 465,
          smtpUser: process.env.SMTP_USER || '',
          smtpPass: '********',
          useSSL: true,
          notificationOnNewOrder: true,
          welcomeEmailEnabled: true
        }
      });
    }

    // Don't return actual password
    const safeSettings = {
      ...settings,
      smtpPass: '********'
    };

    res.json({
      success: true,
      data: safeSettings
    });
  } catch (error) {
    logger.error(`Get email settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения настроек почты'
    });
  }
});

// Update email settings (admin only)
app.put('/api/admin/email-settings', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { 
      adminEmail, 
      senderName, 
      smtpHost, 
      smtpPort, 
      smtpUser, 
      smtpPass, 
      useSSL,
      notificationOnNewOrder,
      welcomeEmailEnabled 
    } = req.body;

    let settings = await prisma.emailSettings.findFirst();

    const updateData = {
      adminEmail: adminEmail || undefined,
      senderName: senderName || undefined,
      smtpHost: smtpHost || undefined,
      smtpPort: smtpPort ? parseInt(smtpPort) : undefined,
      smtpUser: smtpUser || undefined,
      useSSL: useSSL !== undefined ? useSSL : undefined,
      notificationOnNewOrder: notificationOnNewOrder !== undefined ? notificationOnNewOrder : undefined,
      welcomeEmailEnabled: welcomeEmailEnabled !== undefined ? welcomeEmailEnabled : undefined
    };

    // Only update password if provided and not masked
    if (smtpPass && smtpPass !== '********') {
      updateData.smtpPass = smtpPass;
    }

    if (!settings) {
      settings = await prisma.emailSettings.create({
        data: updateData
      });
    } else {
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    // Reinitialize email transporter with new settings
    if (smtpHost && smtpUser) {
      process.env.SMTP_HOST = smtpHost;
      process.env.SMTP_PORT = smtpPort?.toString() || '465';
      process.env.SMTP_USER = smtpUser;
      if (smtpPass && smtpPass !== '********') {
        process.env.SMTP_PASS = smtpPass;
      }
      process.env.SMTP_FROM = senderName ? `${senderName} <${smtpUser}>` : smtpUser;
      process.env.ADMIN_EMAIL = adminEmail;
      
      initializeEmailTransporter();
    }

    logger.info(`Email settings updated by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'Настройки почты обновлены',
      data: {
        ...settings,
        smtpPass: '********'
      }
    });
  } catch (error) {
    logger.error(`Update email settings error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка обновления настроек почты'
    });
  }
});

// ============================================
// 📊 ANALYTICS (ADMIN ONLY)
// ============================================

app.get('/api/admin/analytics', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topProducts,
      newUsers
    ] = await Promise.all([
      prisma.order.count({ where: dateFilter }),
      prisma.order.aggregate({
        where: dateFilter,
        _sum: { total: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: dateFilter,
        _count: true
      }),
      prisma.order.findMany({
        where: dateFilter,
        select: { items: true }
      }),
      prisma.user.count({
        where: dateFilter
      })
    ]);

    // Calculate top products
    const productSales = {};
    topProducts.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { count: 0, revenue: 0 };
        }
        productSales[item.name].count += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        ordersByStatus,
        topProducts: sortedProducts,
        newUsers,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    logger.error(`Get analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения аналитики'
    });
  }
});

// ============================================
// 🏥 HEALTH CHECK
// ============================================

app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    logger.error(`Health check failed: ${error.message}`);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

// ============================================
// ❌ ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Внутренняя ошибка сервера'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================
// 🚀 SERVER STARTUP
// ============================================

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close database connections
    await prisma.$disconnect();
    logger.info('Database connections closed');
    
    // Close server
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  } catch (error) {
    logger.error(`Shutdown error: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 S.A.D. FOOD Backend Server`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔌 Port: ${PORT}`);
  logger.info(`📊 Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

export default app;