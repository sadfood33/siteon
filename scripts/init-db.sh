# scripts/init-db.sh
# ============================================
# 🗄️ DATABASE INITIALIZATION SCRIPT
# ============================================

#!/bin/bash
set -e

echo "🚀 Initializing S.A.D. FOOD Database..."

# Create extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create application user if not exists
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
            CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
        END IF;
    END
    \$\$;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $DB_USER;
    GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;
EOSQL

echo "✅ Database initialized successfully!"