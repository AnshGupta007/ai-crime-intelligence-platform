# Deployment

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

## Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Build & Deploy

### Development
```bash
npm install
npx drizzle-kit push    # Sync database schema
npm run dev             # http://localhost:3000
```

### Production
```bash
npm run build
npm start               # http://localhost:3000
```

### Docker (Future)
```bash
docker-compose up -d    # Starts app + PostgreSQL
```

## Manual Deploy Steps

1. Clone repository on server
2. Install Node.js 20+ and PostgreSQL 15+
3. Create database and user
4. Copy `.env.example` to `.env` and fill in values
5. Run `npm install --production`
6. Run `npx drizzle-kit push` to create tables
7. Run seed script if needed: `npm run seed`
8. Run `npm run build`
9. Start with `npm start` (use PM2 or systemd for process management)

## Nginx Reverse Proxy (Recommended)

```nginx
server {
    listen 80;
    server_name cipap.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

- Health check: `GET /api/health`
- Application logs via `stdout` / `stderr`
- Next.js build output for bundle analysis
