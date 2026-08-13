# 🏋️ Gym API

A RESTful API for a gym check-in system, built around **SOLID** principles, a **Clean Architecture**-inspired structure, and **Test-Driven Development (TDD)**. It handles user authentication, gym registration, geolocation-based check-ins, and admin validation — with business rules enforced at the use-case layer and covered by both unit and end-to-end tests.

## 📋 About the project

The Gym API allows members to register, authenticate, check in at nearby gyms, and track their check-in history and metrics. Admin users can register new gyms and validate members' check-ins. The application enforces real business rules, such as a maximum check-in distance and a daily check-in limit per user.

## 🚀 Features

- User registration and authentication (JWT, with refresh token via HTTP-only cookie)
- Role-based access control (`ADMIN` / `MEMBER`)
- Gym registration (admin only)
- Search gyms by name (paginated)
- Fetch nearby gyms based on user's geolocation
- Check in at a gym, validating the user's distance from it
- Limit of one check-in per user per day
- Admin validation of check-ins, within a 20-minute time window
- Check-in history (paginated) and total check-in count per user

## 🛠️ Tech stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Web framework | [Fastify](https://fastify.dev/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | PostgreSQL |
| Validation | [Zod](https://zod.dev/) |
| Auth | JWT (`@fastify/jwt`) + HTTP-only cookies (`@fastify/cookie`) |
| Password hashing | bcryptjs |
| Testing | [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest) |
| Date handling | Day.js |
| Bundler | tsup |
| CI/CD | GitHub Actions |
| Containerization | Docker Compose |

## 🏗️ Architecture

The project follows the **Repository Pattern** combined with **Use Cases**, decoupling business logic from the HTTP layer and the database:

```
src/
├── http/
│   └── controllers/     # Route handlers (users, gyms, check-ins)
├── use-cases/
│   ├── factories/       # Factory functions to instantiate use cases with the right repository
│   └── error/           # Custom domain errors
├── repositories/
│   ├── in-memory/       # In-memory implementations, used in unit tests
│   └── prisma/          # Prisma implementations, used in production/e2e tests
├── middlewares/         # verifyJwt, verifyUserRole
├── env/                 # Environment variable validation (Zod)
└── utils/               # Helpers (e.g. distance-between-coordinates)
```

Each use case depends on a repository **interface**, not on a concrete implementation. This makes it possible to swap the Prisma repository for an in-memory one during unit tests — enabling fast tests without hitting a real database.

## 🔗 API Endpoints

### Users

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/users` | No | Register a new user |
| `POST` | `/sessions` | No | Authenticate and receive an access token + refresh token cookie |
| `PATCH` | `/token/refresh` | Refresh cookie | Refresh the access token |
| `GET` | `/me` | Yes | Get the authenticated user's profile |

### Gyms

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/gyms` | Admin | Register a new gym |
| `GET` | `/gyms/search` | Yes | Search gyms by name (`?q=&page=`) |
| `GET` | `/gyms/nearby` | Yes | List gyms near a given lat/long (`?latitude=&longitude=`) |

### Check-ins

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/gyms/:gymId/check-ins` | Yes | Check in at a gym |
| `GET` | `/check-ins/history` | Yes | List the user's check-in history (paginated) |
| `GET` | `/check-ins/metrics` | Yes | Get the total number of check-ins for the user |
| `PATCH` | `/check-ins/:checkInId/validate` | Admin | Validate a member's check-in |

### Business rules enforced

- A user can't check in twice on the same day.
- A user can only check in if they are within **100 meters** of the gym.
- A check-in can only be validated by an admin within **20 minutes** of its creation.
- Only admins can register gyms or validate check-ins.

## ✅ Testing strategy

The project has two separate test suites, run in different CI pipelines:

| Suite | Command | Repository used | Trigger |
|---|---|---|---|
| Unit tests | `npm run test` | In-memory | Every `push` |
| E2E tests | `npm run test:e2e` | Prisma + real PostgreSQL | Every `pull_request` |

Unit tests exercise use cases in isolation against in-memory repositories, keeping them fast and independent of any database. E2E tests spin up a real PostgreSQL instance (via a GitHub Actions service container), run Prisma migrations, and hit the HTTP routes end-to-end with Supertest.

## ⚙️ Getting started

### Prerequisites

- Node.js 22+
- Docker (for the local PostgreSQL instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/barbosalukas/gym-api.git
cd gym-api

# Install dependencies
npm install

# Copy the environment variables file
cp .env-example .env
```

### Running the database

```bash
docker compose up -d
```

### Running migrations

```bash
npx prisma migrate dev
```

### Running the application

```bash
npm run start:dev
```

The server will start on `http://localhost:3333` (or the port set in `PORT`).

### Running the tests

```bash
# Unit tests (in-memory repositories)
npm run test

# E2E tests (requires the database running)
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 🔄 CI/CD

The project uses two GitHub Actions workflows:

- **Run Unit Tests** — runs on every push, installing dependencies, generating the Prisma client, and running the unit test suite against in-memory repositories.
- **Run E2E Tests** — runs on every pull request, spinning up a PostgreSQL service container, running Prisma migrations, and executing the full E2E suite against a real database.

## 📄 License

This project is licensed for personal and educational use.