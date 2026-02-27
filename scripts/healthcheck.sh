# scripts/healthcheck.sh
# ============================================
# 🏥 HEALTH CHECK SCRIPT
# ============================================

#!/bin/sh

# Check if backend is healthy
check_backend() {
    if wget --no-verbose --tries=1 --spider http://backend:3000/api/health 2>/dev/null; then
        echo "✅ Backend is healthy"
        return 0
    else
        echo "❌ Backend is unhealthy"
        return 1
    fi
}

# Check if database is healthy
check_database() {
    if pg_isready -h db -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; then
        echo "✅ Database is healthy"
        return 0
    else
        echo "❌ Database is unhealthy"
        return 1
    fi
}

# Run all checks
echo "🏥 Running health checks..."
check_backend
BACKEND_STATUS=$?

check_database
DB_STATUS=$?

if [ $BACKEND_STATUS -eq 0 ] && [ $DB_STATUS -eq 0 ]; then
    echo "✅ All health checks passed"
    exit 0
else
    echo "❌ Some health checks failed"
    exit 1
fi