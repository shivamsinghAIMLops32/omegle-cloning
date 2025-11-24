# Complete Docker Stack Startup Guide

## 🚀 Quick Start (Everything in Docker)

This will start:
- PostgreSQL database
- Redis cache  
- Next.js app
- Caddy reverse proxy

### Start Everything

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### First Time Setup

```bash
# Run database migrations (first time only)
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client (first time only)
docker-compose exec app npx prisma generate
```

### Access

- **Main App:** http://localhost
- **Alternative Port:** http://localhost:8080
- **Admin Panel:** http://localhost/admin

### Useful Commands

```bash
# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart app
docker-compose restart caddy

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f caddy
docker-compose logs -f postgres

# Rebuild after code changes
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔍 Troubleshooting

### App won't start
```bash
docker-compose logs app
```

### Database issues
```bash
docker-compose exec postgres psql -U postgres -d strangerconnect
```

### Clear everything and start fresh
```bash
docker-compose down -v  # WARNING: Deletes all data!
docker-compose up -d
```
