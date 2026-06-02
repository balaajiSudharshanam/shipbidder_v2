<div align="center">

<h1>ShipBidder</h1>
<p><strong>Reverse-auction freight platform &mdash; lowest bid wins.</strong></p>

<p>
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-4-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

</div>

---

## What is ShipBidder?

ShipBidder connects **job posters** who need freight moved with **carriers** who want the work. Employers post logistics jobs with a budget ceiling; carriers place bids. The **lowest bid wins** — keeping costs competitive for employers and giving carriers full control over what they take on.

---

## Features

| Status | Feature |
|--------|---------|
| Done | Email/password registration & login |
| Done | Google OAuth 2.0 sign-in |
| Done | Role selection (Job Poster / Carrier) |
| Done | JWT cookie-based session auth |
| Done | Multi-step job posting (route → shipment → auction terms) |
| Done | Shipment image upload (up to 4, stored on Cloudinary) |
| Done | Google Maps geocoding & route display |
| Done | Reverse-auction bidding engine (lowest bid wins) |
| Done | Job detail page — route map, image carousel, bid list |
| Done | Role-based dashboards (Job Poster & Carrier) |
| Done | Toast notification system |
| Soon | Route optimisation (pick up jobs en route) |
| Soon | AI assistant for drivers & job posters |
| Soon | Employer fleet management dashboard |

---

## How It Works

```
Job Poster creates job  →  Carriers browse & bid  →  Lowest bid wins  →  Job assigned
```

1. **Job Poster** creates a freight job: picks up/drop-off locations (geocoded via Google Maps), describes the shipment, uploads photos, and sets a budget ceiling + auction close time.
2. **Carriers** browse open jobs, click through to a detail page showing the optimised route on a Google Map and any shipment images, then place a bid below the ceiling.
3. The auction closes and the **lowest bid** is awarded the job.
4. *(coming soon)* The route optimisation module suggests additional pickups along the driver's planned route.

---

## Tech Stack

### Backend
- **Java 21** + **Spring Boot 4** (Spring Framework 7)
- **Spring Security** — OAuth2 (Google OIDC) + local auth with JWT HttpOnly cookies
- **PostgreSQL 16** — primary data store; schema managed by Hibernate DDL
- **Cloudinary** — shipment image storage
- **Google Maps Geocoding API** — server-side address resolution
- **Docker** — containerised with multi-stage Dockerfile

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Google Maps JavaScript API** — interactive route display (DirectionsService / DirectionsRenderer)
- Custom design system — palette `#1c1b1b` / `#474545` / `#f3f3f3`, Source Sans Pro
- Feature-based folder structure with shared `common/` components and hooks

### Infrastructure
- **Nginx** — reverse proxy, single entry point on port 80
- **Docker Compose** — dev and production configs

---

## Project Structure

```
shipbidder/
├── backend/src/main/java/.../
│   ├── auth/          # JWT, OAuth2, security filter
│   ├── user/          # User entity, roles, profile
│   ├── job/           # Job entity, posting, auction status
│   ├── bid/           # Bid entity, reverse-auction engine
│   ├── shipment/      # Shipment entity, Cloudinary image upload
│   ├── location/      # Location entity, geocoded addresses
│   ├── upload/        # Cloudinary upload service
│   └── common/        # ApiRoutes, exceptions, global handler
├── frontend/src/
│   ├── common/
│   │   ├── components/    # AppNav (shared nav bar)
│   │   ├── context/       # ToastContext, UserContext
│   │   ├── hooks/         # useFormatters
│   │   └── apiRoutes.ts / appRoutes.ts
│   └── features/
│       ├── auth/          # Login, Register
│       ├── user/          # Role selection, UserContext
│       ├── dashboard/     # JobPosterDashboard, CarrierDashboard
│       ├── jobs/          # JobsPage, JobDetailPage, PostJobModal,
│       │                  #   JobCard, RouteMap, ImageCarousel,
│       │                  #   BidList, PlaceBidForm, StepIndicator
│       └── locations/     # Location picker, locationsApi
├── nginx/
│   ├── nginx.conf                # Production config
│   └── nginx.dev.conf            # Dev config (Vite HMR support)
├── docker-compose.yml            # Production Compose
└── docker-compose.override.yml   # Dev overrides (auto-loaded)
```

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A Google OAuth 2.0 client (for social login)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A Google Maps API key with **Maps JS**, **Geocoding**, and **Directions** APIs enabled

### 1. Environment setup

```bash
cp .env.example .env
```

Fill in `.env`:

```env
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

ONBOARDING_JWT_SECRET=your-32-char-secret
AUTH_JWT_SECRET=your-32-char-secret

FRONTEND_URL=http://localhost

GOOGLE_MAPS_API_KEY=your-server-side-maps-key
VITE_GOOGLE_MAPS_API_KEY=your-client-side-maps-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Google OAuth setup

In [Google Cloud Console](https://console.cloud.google.com/):
- Authorised JavaScript origin: `http://localhost`
- Authorised redirect URI: `http://localhost/login/oauth2/code/google`

### 3. Run (development)

```bash
docker compose up --build
```

The app is available at **http://localhost**.

| Service | Address |
|---------|---------|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| PostgreSQL | localhost:5432 |
| Backend direct | localhost:8080 |

### 4. Run (production)

```bash
docker compose -f docker-compose.yml up --build -d
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register with email and password |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/oauth2/authorization/google` | Initiate Google OAuth flow |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user/me` | Auth token | Get current user profile |
| `POST` | `/api/user/update-role` | Onboarding token | Set role after registration |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/jobs` | JOB_POSTER | Create a new job |
| `GET` | `/api/jobs` | Any | List all open jobs |
| `GET` | `/api/jobs/my` | JOB_POSTER | List my posted jobs |
| `GET` | `/api/jobs/{id}` | Any | Get job detail |
| `POST` | `/api/jobs/{id}/images` | JOB_POSTER | Upload shipment images (max 4) |

### Bids

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/jobs/{id}/bids` | BIDDER | Place a bid on a job |
| `GET` | `/api/jobs/{id}/bids` | JOB_POSTER (owner) | View all bids, sorted lowest first |

### Locations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/locations` | Any | List saved locations |
| `POST` | `/api/locations` | Any | Save a geocoded location |

---

## Architecture

ShipBidder follows **Domain-Driven Design (DDD)**. Each domain has four layers:

```
domain/         Entity, Repository, Enums
application/    Business logic (Services)
api/            Controllers, Request/Response DTOs
mapper/         Entity ↔ DTO mapping
```

Authentication uses two JWT types issued as **HttpOnly cookies**:
- `onboarding_token` (10 min) — scoped to role selection only
- `auth_token` (24 h) — full session token

---

## What Broke & How I Fixed It

Real bugs hit during development, documented here as a reference.

---

### 1. `500 Internal Server Error` on `/api/auth/register`

**Symptom:** Every call to `POST /api/auth/register` returned 500 even for brand-new email addresses.

**Root cause:** `JwtAuthenticationFilter` ran on every request including public endpoints. On register, the browser sent a stale `auth_token` cookie from a previous session. The filter tried to load that user from the database, the account no longer existed, Spring threw `UsernameNotFoundException`, and nothing caught it.

**Fix:** Added `shouldNotFilter()` to skip the filter entirely for `/api/auth/**`, and wrapped the `loadUserByUsername` call in a try/catch so stale tokens on other routes degrade gracefully to an unauthenticated request instead of a 500.

---

### 2. Had to reload the page after registering to log in

**Symptom:** After completing registration → role selection, navigating to the dashboard would redirect back to login. Reloading fixed it.

**Root cause — two separate bugs:**

- **Bug A:** `UserController.updateRole` cleared the `onboarding_token` but never issued an `auth_token`. So after role selection the user had no valid session cookie; `refreshUser()` got a 401 and set `user = null`.
- **Bug B:** `LoginPage` called `navigate('/dashboard')` immediately after the login API responded, without waiting for `refreshUser()`. React Router rendered `DashboardRouter` while `UserContext` still held `null`, so it redirected back to `/login`.

**Fix:** Changed `UserService.updateRole` to return the saved `User` entity so `UserController` could generate and set the `auth_token` cookie in the same response. Also added `await refreshUser()` in `LoginPage` before navigating, so the context is populated before the route change.

---

### 3. `502 Bad Gateway` — duplicate `spring:` key in `application.yml`

**Symptom:** After adding multipart file upload config, the backend container exited immediately and Nginx returned 502.

**Root cause:** Added `spring.servlet.multipart` settings as a second top-level `spring:` block in `application.yml`. Spring's YAML parser treats duplicate root keys as an error and refuses to start.

**Fix:** Merged the `servlet.multipart` config into the existing `spring:` block. YAML does not allow the same key twice at the same level.

---

### 4. `502 Bad Gateway` after adding Cloudinary — env vars not reaching the container

**Symptom:** Backend started fine locally but crashed inside Docker after Cloudinary credentials were added to `.env`.

**Root cause:** The root `.env` file is loaded by Docker Compose for variable substitution in `docker-compose.yml`, but variables are only forwarded to a container if they are explicitly listed under that service's `environment:` block. `CLOUDINARY_*` vars were in `.env` but missing from the `backend:` service definition, so Spring could not resolve `${CLOUDINARY_CLOUD_NAME}` and threw an `IllegalArgumentException` on startup.

**Fix:** Added all Cloudinary variables (and `GOOGLE_MAPS_API_KEY`) to the `environment:` block of the `backend` service in `docker-compose.yml`.

---

### 5. `ReferenceError: setError is not defined` in `PostJobModal`

**Symptom:** Submitting the job posting form crashed with an uncaught `ReferenceError` in the console.

**Root cause:** During a refactor to replace inline error state with the shared `ToastContext`, the `error` state and `setError` were removed from the component — but one call `setError(null)` on line 52 was left behind.

**Fix:** Deleted the orphaned `setError(null)` call.

---

### 6. `VITE_GOOGLE_MAPS_API_KEY` was `undefined` inside the frontend container

**Symptom:** The Google Maps script loaded but the API key was an empty string, causing the map to fail with an `InvalidKeyMapError`.

**Root cause:** Vite replaces `import.meta.env.VITE_*` variables at **build time**, not runtime. The root `.env` file sits outside the `frontend/` directory, which is the Docker build context. The variable was never injected into the image.

**Fix:** Added an `ARG VITE_GOOGLE_MAPS_API_KEY` and corresponding `ENV` to the frontend `Dockerfile` so the value is baked in during `docker build`. For production it is passed via `args:` in `docker-compose.yml`; for development it is set under `environment:` in `docker-compose.override.yml` (Vite dev server reads it at runtime so no rebuild is needed).

---

<div align="center">
  <p>Built by <strong>Balaaji Sudharshanam</strong></p>
</div>
