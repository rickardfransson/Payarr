# Payarr

Payarr is a subscription and membership management platform designed to automate payments, subscriptions, and access control for Emby users.

The system manages users, subscriptions, payments, and synchronization with external services through a modern web interface.

Payarr is built with **FastAPI, React, PostgreSQL, and Docker**.

---

# Features

- JWT-based authentication
- User management
- Admin dashboard
- Subscription management
- Payment tracking
- Emby account linking
- Automatic Emby access synchronization
- Scheduled background synchronization
- Import users from Emby
- First-login password change workflow
- Admin password reset functionality
- Responsive web interface
- Docker-based deployment

---

# Technology Stack

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- APScheduler
- Pydantic Settings

## Frontend

- React
- TypeScript
- Vite

## Database

- PostgreSQL 16

## Infrastructure

- Docker
- Docker Compose
- Linux server deployment

---

# Architecture

```
                Internet
                   |
              Reverse Proxy
            (Nginx / Traefik)
                   |
          --------------------
          |                  |
      Frontend            Backend
       React              FastAPI
                              |
                         PostgreSQL
                              |
                            Emby
                              |
                       Payment Provider
```

---

# Project Structure

```
Payarr/
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── scheduler/
│   ├── alembic/
│   └── Dockerfile
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── Dockerfile
│
├── docker-compose.yml
├── .env
├── .env.example
└── README.md
```

---

# Configuration

Payarr uses a single root `.env` file.

The `.env` file must never be committed to GitHub.

Example:

```env
# Database

POSTGRES_USER=payarr
POSTGRES_PASSWORD=change_me
POSTGRES_DB=payarr


# Security

SECRET_KEY=change_this_secret


# Emby

EMBY_URL=https://emby.example.com
EMBY_API_KEY=your_emby_api_key


# Payments

PAYMENT_PROVIDER=swish
SWISH_NUMBER=0700000000


# BTCPay Server (production)

BTCPAY_URL=https://btcpay.example.com
BTCPAY_API_KEY=
BTCPAY_STORE_ID=
```

---

# Development Environment

## Start Backend and Database

```bash
docker compose up --build -d
```

Backend:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

---

## Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5174
```

---

# Database Migrations

Create a migration:

```bash
docker compose exec payarr-backend alembic revision --autogenerate -m "description"
```

Apply migrations:

```bash
docker compose exec payarr-backend alembic upgrade head
```

---

# Authentication

Payarr uses JWT authentication.

## Login

```
POST /api/v1/auth/login
```

## Current User

```
GET /api/v1/me
```

---

# User Roles

| Role | Description |
|---|---|
| user | Regular member |
| admin | Full administrative access |

---

# Emby Integration

Payarr integrates with Emby to control user access based on subscription status.

Users are manually linked between Payarr and Emby.

## Synchronization Logic

Active subscription:

```
Subscription active
        |
        v
Enable Emby access
```

Expired subscription:

```
Subscription expired
        |
        v
Disable Emby access
```

## Scheduler

Background synchronization runs automatically every 15 minutes.

## Important

Payarr does **not automatically create Emby accounts**.

Users are linked manually through the administration interface.

---

# Payments

Payarr contains payment handling functionality.

Stored payment information includes:

- Provider
- Amount
- Currency
- Payment status
- Invoice information
- Checkout URL

Current development provider:

```
Swish
```

Production target:

```
BTCPay Server
```

---

# First Login Password Flow

Imported users can receive a temporary password.

Flow:

1. Administrator creates or resets password
2. User logs in
3. System detects `must_change_password`
4. User is redirected to password change
5. New password is stored
6. Account becomes active

---

# Administration Features

The admin panel supports:

- Dashboard overview
- User management
- User details
- Emby account management
- Emby user import
- Payment overview
- Password reset
- System settings

---

# API Overview

## Authentication

```
POST /api/v1/auth/register

POST /api/v1/auth/login
```

## Profile

```
GET /api/v1/me
```

## Users

```
GET /api/v1/users

POST /api/v1/users

GET /api/v1/users/{user_id}/overview
```

## Administration

```
POST /api/v1/admin/users/{user_id}/reset-password

POST /api/v1/admin/emby/import
```

---

# Production Deployment

## Requirements

Recommended production environment:

- Debian 12
- Docker Engine
- Docker Compose Plugin
- Git
- Reverse proxy
- HTTPS certificate

---

## Install Server Dependencies

```bash
sudo apt update

sudo apt install -y git docker.io docker-compose-plugin
```

Enable Docker:

```bash
sudo systemctl enable docker

sudo systemctl start docker
```

---

## Clone From GitHub

Production deployments should always use the repository.

Example:

```bash
cd /opt

git clone https://github.com/<username>/Payarr.git

cd Payarr
```

---

## Configure Production Environment

Create environment file:

```bash
cp .env.example .env
```

Edit:

```bash
nano .env
```

Configure:

- Database credentials
- JWT secret
- Emby connection
- Payment provider
- Production URLs

---

## Start Production Stack

Build and start:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

---

## Database Migration

Run:

```bash
docker compose exec payarr-backend alembic upgrade head
```

---

## Automatic Startup After Reboot

All production services should use:

```yaml
restart: unless-stopped
```

Example:

```yaml
services:

  payarr-backend:
    restart: unless-stopped

  payarr-db:
    restart: unless-stopped

  payarr-frontend:
    restart: unless-stopped
```

Docker will automatically start Payarr after server reboot.

---

# Updating Production

Pull latest changes:

```bash
cd /opt/Payarr

git pull
```

Rebuild:

```bash
docker compose up -d --build
```

Run migrations if needed:

```bash
docker compose exec payarr-backend alembic upgrade head
```

---

# Logs

All services:

```bash
docker compose logs -f
```

Backend:

```bash
docker compose logs -f payarr-backend
```

Frontend:

```bash
docker compose logs -f payarr-frontend
```

Database:

```bash
docker compose logs -f payarr-db
```

---

# Backup

Production backups should include:

- PostgreSQL database
- `.env` configuration
- Future uploaded files

Database backup example:

```bash
docker compose exec payarr-db pg_dump -U payarr payarr > backup.sql
```

Store backups outside the production server.

---

# Production Checklist

Before going live:

- [ ] HTTPS enabled
- [ ] Strong database password configured
- [ ] Strong JWT secret configured
- [ ] `.env` excluded from Git
- [ ] Database migrations completed
- [ ] Admin account created
- [ ] Emby connection tested
- [ ] Payment provider configured
- [ ] Automatic restart enabled
- [ ] Backup strategy configured

---

# Project Status

| Component | Status |
|---|---|
| Backend API | Completed |
| JWT Authentication | Completed |
| Admin Panel | Completed |
| Emby Synchronization | Completed |
| First Login Password Flow | Completed |
| Mobile Interface | Completed |
| Swish Payment Flow | Basic implementation |
| BTCPay Integration | Planned |
| Production Deployment | Ready for deployment |

---

# Development Notes

- Frontend development is mainly performed using **Notepad++**
- Backend changes require:

```bash
docker compose up --build -d
```

- The project uses one root `.env` file
- Deployment is based on GitHub source control

---

# Legal Disclosure & Compliance

Payarr is software intended to assist with subscription management, user administration, payment tracking, and integration with external services such as Emby.

Payarr does not provide legal, financial, tax, accounting, or payment-processing services.

The operator of any Payarr installation is responsible for ensuring compliance with all applicable laws and regulations.

---

## Operator Responsibilities

The operator is responsible for:

- Subscription terms
- Consumer protection requirements
- Refund handling
- Tax and accounting obligations
- Payment provider compliance
- Privacy policies
- User communication
- Lawful use of connected services

---

## Payments

Payarr may integrate with payment providers.

Payarr does not operate as:

- A bank
- A payment institution
- A financial service provider

The operator is responsible for selecting and configuring compliant payment solutions.

---

## Privacy & Personal Data

Payarr processes user information required for:

- Authentication
- Account management
- Subscription handling
- Access control

Operators are responsible for:

- GDPR compliance where applicable
- Privacy notices
- Data retention policies
- User data requests
- Security controls

---

## Third-Party Services

Payarr integrates with external services including:

- Emby
- Payment providers
- Future BTCPay Server deployments

Operators are responsible for reviewing and complying with third-party agreements.

---

## No Warranty

Payarr is provided as software developed on a best-effort basis.

No guarantee is provided that Payarr fulfills specific legal, commercial, security, or regulatory requirements.

The operator is responsible for evaluating whether Payarr is suitable for their intended use.

---

# License

Private project.

No open-source license has been granted unless explicitly stated.

All rights reserved.

---

# Author

**Rickard Frandson**

Payarr Project  
2026