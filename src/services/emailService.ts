import { Order, EmailSettings } from '../types/db';
import { api } from './api';

/**
 * Mock Email Service
 * In a real application, you would use a service like EmailJS, SendGrid, or a custom backend.
 */
export const emailService = {
  /**
   * Sends an order confirmation email to the shop owner and the customer.
   */
  sendOrderConfirmation: async (order: Order, customerEmail: string) => {
    // Attempt to get configured settings
    let settings: EmailSettings;
    try {
      settings = await api.admin.getEmailSettings();
    } catch {
      // Fallback if DB not ready
      settings = {
        adminEmail: 'shop@sadfood.com',
        senderName: 'S.A.D. Food Delivery',
        smtpHost: 'smtp.example.com',
        smtpPort: 465,
        smtpUser: 'shop@sadfood.com',
        smtpPass: '********',
        useSSL: true,
        notificationOnNewOrder: true,
        welcomeEmailEnabled: true,
      };
    }

    console.log('--- ATTEMPTING TO SEND EMAIL WITH CURRENT SETTINGS ---');
    console.log(`SMTP Server: ${settings.smtpHost}:${settings.smtpPort} (SSL: ${settings.useSSL})`);
    console.log(`Authenticated as: ${settings.smtpUser}`);
    console.log(`Sender Name: ${settings.senderName}`);
    
    if (settings.notificationOnNewOrder) {
      console.log(`>> Notifying Shop Admin at: ${settings.adminEmail}`);
    }
    
    if (settings.welcomeEmailEnabled) {
      console.log(`>> Sending Confirmation to Customer: ${customerEmail}`);
    }
    
    const itemsList = order.items.map(item => 
      `${item.name} x${item.quantity} - ${item.price * item.quantity} ₽`
    ).join('\n');

    const emailBody = `
      Здравствуйте! Ваш заказ #${order.id} принят.
      
      Детали заказа:
      ---------------------------------
      Состав:
      ${itemsList}
      ---------------------------------
      Сумма: ${order.total} ₽
      Адрес доставки: ${order.deliveryAddress}
      Способ оплаты: ${order.paymentMethod === 'card' ? 'Картой' : 'Наличными'}
      
      Мы свяжемся с вами в течение 5 минут для подтверждения.
      С уважением, команда ${settings.senderName}.
    `;

    console.log('Email Body Content:');
    console.log(emailBody);
    
    console.log('--- SIMULATED SMTP CONNECTION SUCCESSFUL ---');
    console.log('--- EMAILS SENT SUCCESSFULLY ---');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return true;
  }
};
