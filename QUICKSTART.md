# 🚀 Quick Start - Local Development

## Step 1: Update Your `.env` File

Open your `.env` file and update it with these values:

```env
DATABASE_URL="postgresql://postgres:changeme@localhost:5432/strangerconnect"
REDIS_URL="redis://localhost:6379"
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 2: Start Docker Databases

```bash
# Start PostgreSQL and Redis in Docker
docker-compose -f docker-compose.dev.yml up -d

# Check they're running
docker-compose -f docker-compose.dev.yml ps
```

You should see:

- ✅ strangerconnect-db (PostgreSQL on port 5432)
- ✅ strangerconnect-redis (Redis on port 6379)

## Step 3: Run Database Migrations

```bash
npx prisma migrate dev
```

## Step 4: Start Your App

```bash
npm run dev
```

## 🎯 Access Points

- **App:** http://localhost:3000
- **Admin:** http://localhost:3000/admin
- **Text Chat:** http://localhost:3000/chat/text
- **Video Chat:** http://localhost:3000/chat/video

## 🛑 Stop Everything

```bash
# Stop Docker databases
docker-compose -f docker-compose.dev.yml down

# Stop app (Ctrl+C in terminal)
```

## ✅ You're All Set!

This setup is perfect for local development:

- Databases run in Docker (easy cleanup)
- App runs normally (easy debugging)
- Hot reload works perfectly
