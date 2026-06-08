# Hyperyadak

Hyperyadak is a full-stack web application built with a Django backend and a React frontend. It provides a REST API, background task processing, and a modern SPA frontend served by Vite during development. The project is containerized with Docker and orchestrated using Docker Compose.

**Tech stack**

- Backend: Python, Django 5.x, Django REST Framework
- Database: PostgreSQL
- Caching / Broker: Redis
- Background jobs: Celery
- Frontend: React, Vite, Tailwind CSS (configured in frontend)
- Containerization: Docker, Docker Compose
- Web server (production): Gunicorn + Nginx
- SMS provider: SMS.ir (configurable via env)
- Payment gateway: Zarinpal (sandbox mode available)

**Key project structure**

- `backend/` — Django project and server code
- `frontend/` — React app (Vite) and static assets
- `nginx/` — production proxy configuration
- `docker-compose.yml` & `docker-compose.prod.yml` — compose configs for dev and production

**Local development (recommended, Docker)**

1. Copy environment example (do not store secrets in VCS):

```bash
cp .env.example .env
```

2. Build and start services:

```bash
docker compose build
docker compose up -d
```

3. Run migrations and create a superuser:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

4. Frontend dev server (if you prefer running outside Docker):

```bash
cd frontend
npm install
npm run dev
```

**Contributing**
Please open issues for bugs or feature requests and submit pull requests for fixes. Include tests for backend changes and ensure frontend builds locally in dev mode.
