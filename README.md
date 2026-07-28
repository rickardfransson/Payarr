# Payarr

**Payarr** is a subscription and membership management platform designed to automate payments, subscriptions, and access control for **Emby** users.

The system manages users, subscriptions, payments, and synchronization with external services through a modern web interface.

Payarr is built using **FastAPI, React, PostgreSQL, and Docker**.

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

## Deployment

- Docker
- Docker Compose

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

All configuration is stored in the root `.env` file.

Example:

```env
# Database
POSTGRES_USER=payarr
POSTGRES_PASSWORD=change_me
POSTGRES_DB=payarr

# JWT
SECRET_KEY=change_this_secret

# Emby
EMBY_URL=https://emby.example.com
EMBY_API_KEY=your_emby_api_key

# Payment Provider
PAYMENT_PROVIDER=swish
SWISH_NUMBER=0700000000

# BTCPay (future production use)
BTCPAY_URL=https://btcpay.example.com
BTCPAY_API_KEY=
BTCPAY_STORE_ID=
```

---

# Running Development Environment

## Start backend and database

```bash
docker compose up --build -d
```

Backend:

```
http://localhost:8000
```

API documentation:

```
/docs
/redoc
```

---

## Start frontend

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

## Current user

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

Each Payarr user can be manually connected to an existing Emby account.

## Synchronization Logic

Active subscription:

```
Payarr subscription active
        ↓
Enable Emby access
```

Expired subscription:

```
Subscription expired
        ↓
Disable Emby access
```

## Scheduler

Background synchronization runs automatically every 15 minutes.

## Important

Payarr **does not automatically create Emby accounts**.

Users are manually linked to existing Emby accounts through the administration interface.

---

# Payments

Payarr currently contains a basic payment implementation.

Supported payment information:

- Amount
- Currency
- Payment status
- Provider information
- Checkout URL

Current development provider:

```
Swish
```

Future production integration:

```
BTCPay Server
```

---

# First Login Password Flow

Imported users can receive an administrator-defined temporary password.

During first login:

1. User logs in with temporary password
2. System detects `must_change_password`
3. User is redirected to password change page
4. New password is saved
5. Account becomes fully active

---

# Administration Features

The admin panel currently supports:

- Dashboard overview
- User management
- User details
- Emby account management
- Import users from Emby
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

Recommended production architecture:

```
Internet
    |
Reverse Proxy
(Nginx / Traefik)
    |
Frontend
(React)
    |
Backend
(FastAPI)
    |
PostgreSQL
    |
Emby
    |
BTCPay Server
```

Recommended server:

- Debian 12
- Docker Engine
- Docker Compose Plugin
- HTTPS with Let's Encrypt

---

# Deployment From GitHub

Example:

```bash
git clone https://github.com/<username>/Payarr.git

cd Payarr

cp .env.example .env

docker compose up -d --build
```

---

# Project Status

| Component | Status |
|---|---|
| Backend API | Completed |
| JWT Authentication | Completed |
| Admin Panel | Completed |
| Emby Synchronization | Completed |
| First Login Password Flow | Completed |
| Mobile UI | Completed |
| Swish Payment Flow | Basic implementation |
| BTCPay Integration | Planned |
| Production Deployment | In progress |

---

# Development Notes

- Frontend development is primarily done using **Notepad++**
- Backend changes require rebuilding containers:

```bash
docker compose up --build -d
```

- The project uses a single root `.env` file for configuration

---

# Legal Disclosure & Compliance

Payarr is a software platform intended to assist with subscription management, user administration, payment tracking, and integration with external services such as Emby.

The software itself does not provide legal, financial, tax, accounting, or payment-processing services.

The operator of any Payarr installation is responsible for ensuring that their use of the system complies with all applicable laws and regulations.

## Operator Responsibilities

The operator is responsible for:

- Compliance with applicable consumer protection laws
- Correct handling of subscriptions, renewals, cancellations, and refunds
- Correct taxation and accounting treatment of payments
- Compliance with payment provider requirements
- Maintaining terms of service and privacy policies
- Informing users how personal data is processed
- Ensuring lawful use of connected third-party services

---

## Payments

Payarr may store payment-related information and integrate with payment providers.

Payarr does not act as a bank, payment institution, or regulated financial service.

The operator is responsible for ensuring that the selected payment solution complies with applicable regulations.

---

## Personal Data & Privacy

Payarr processes user information required for:

- Account management
- Authentication
- Subscription handling
- Access control

Operators are responsible for:

- Determining the legal basis for processing personal data
- Providing privacy information to users
- Handling data requests
- Protecting stored personal information
- Implementing appropriate security controls

Depending on jurisdiction and usage, privacy regulations such as GDPR may apply.

---

## Third-Party Services

Payarr integrates with external services including:

- Emby
- Payment providers
- Future payment infrastructure such as BTCPay Server

Operators are responsible for:

- Reviewing third-party agreements
- Correct configuration
- Compliance with external service terms

---

## No Warranty

Payarr is provided as software and developed on a best-effort basis.

No guarantee is provided that the software fulfills specific legal, commercial, security, or regulatory requirements.

Users and operators are responsible for evaluating whether Payarr is suitable for their intended purpose.

---

# License

Private project.

No open-source license has been granted unless explicitly stated.

All rights reserved.

---

