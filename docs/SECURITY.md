# Security Requirements

## Authentication

- **JWT tokens** for all API authentication
- Tokens expire after 24 hours
- Refresh token rotation on re-login
- Passwords hashed with bcrypt (cost factor 12)

## Authorization (RBAC)

| Role | Access Level |
|------|-------------|
| SCRB | Full access to all districts, cases, analytics |
| SP | Access limited to assigned district |
| IO | Access limited to assigned police station |

- All API routes verify JWT and role before returning data
- District/station scoping enforced in database queries

## Data Protection

- **HTTPS only** in production
- No plaintext passwords in database
- No secrets or keys in client-side code
- Environment variables for all secrets
- `.env` files never committed to version control

## API Security

- Rate limiting on auth endpoints (5 attempts per minute)
- Input validation on all API inputs (TypeScript + runtime checks)
- SQL injection prevention via Drizzle ORM parameterized queries
- CORS configured to allow only the frontend origin

## XSS Prevention

- React JSX auto-escapes output by default
- Content Security Policy header set
- No `dangerouslySetInnerHTML` without explicit review

## CSRF Protection

- SameSite cookie policy for any cookie-based auth
- CSRF tokens for state-changing requests

## Secrets Management

```
# .env (never committed)
DATABASE_URL=postgresql://...
JWT_SECRET=<random-64-char-hex>
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- Production secrets managed through environment variables on the server
- No API keys hardcoded in source code
