# 🚀 Dalam Kemasan - Cloud Storage Management SaaS

> A comprehensive cloud computing learning project featuring microservices architecture, authentication, file storage, and monitoring stack.

**Created by:**
```
1. Andreandhiki Riyanta Putra (23/517511/PA/22191)
2. Daffa Indra Wibowo
3. Fahmi Shampoerna
4. Muhammad Argya Vityasy (23/522547/PA/22475) Auditing, Docker
5. Najma Clara Bella
6. Rayhan Firdaus Ardian
7. Sultan Devino Suyudi
```  
**Lecturer:** I Gede Mujiyatna - Cloud Computing KOM  

---

## 📋 Project Overview

Dalam Kemasan is a production-ready SaaS application designed to demonstrate modern cloud computing principles. It features a Go-based microservice architecture with comprehensive monitoring, logging, and containerized deployment using Docker Compose.

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 📁 **File Management** - Upload, download, delete files with S3-compatible storage
- 💾 **Storage Quotas** - Package-based storage limits (Free/Premium)
- 📊 **Real-time Monitoring** - Prometheus metrics & Grafana dashboards
- 📝 **Centralized Logging** - Loki + Promtail log aggregation
- 🛡️ **Security Hardened** - Rate limiting, request validation, security headers
- 🐳 **Containerized** - Full Docker Compose orchestration
- 🔄 **Graceful Shutdown** - Proper service lifecycle management

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Service        │────│   PostgreSQL    │
│   (React/Vue)   │    │     (Go)        │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     MinIO       │
                    │  Object Storage │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Prometheus  │    │    Loki     │    │   Grafana   │
│  Metrics    │    │   Logging   │    │ Dashboards │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git
- 8GB+ RAM recommended

### 1. Clone Repository

```bash
git clone https://github.com/vityasyyy/dalam-kemasan.git
cd dalam-kemasan
```

### 2. Environment Setup

Create the main environment file:

```bash
# .env
GRAFANA_PORT=3000
AUTH_SERVICE_PORT=8081
```

Create service environment file:

```bash
# service/.env
DB_URL=postgresql://dalamKemasan:securepassword123@service-db:5432/service_db?sslmode=disable
JWT_ACCESS_SECRET=your-super-secret-jwt-key-here-change-this
PORT=8081
CORS_URL=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
LOG_LEVEL=debug

# MinIO Configuration
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY_ID=minioadmin
MINIO_SECRET_ACCESS_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=dalam-kemasan-files
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123

# Email Settings (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Create Docker Network

```bash
docker network create dalam-kemasan-network
```

### 4. Launch Services

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 5. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:8081 | - |
| **Grafana** | http://localhost:3000 | admin / admin |
| **Prometheus** | http://localhost:9090 | - |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin123 |

## 📚 API Documentation

### Endpoints

```bash
# Register user
POST /api/v1/user/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}

# Login
POST /api/v1/user/login
{
  "email": "user@example.com",
  "password": "securepassword"
}

# Upload file (requires auth)
POST /api/v1/auth/files/upload
Content-Type: multipart/form-data
file: [file_data]

# List files
GET /api/v1/auth/files/list

# Download file
GET /api/v1/auth/files/download/{fileID}

# Upgrade package
POST /api/v1/auth/billing/upgrade
{
  "package": "premium"
}
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Go 1.21+, Gin Framework |
| **Database** | PostgreSQL 17 |
| **Storage** | MinIO (S3-compatible) |
| **Monitoring** | Prometheus + Grafana |
| **Logging** | Loki + Promtail |
| **Containerization** | Docker + Docker Compose |
| **Authentication** | JWT (Access + Refresh tokens) |
| **Security** | bcrypt, Rate limiting, CORS |

## 🔧 Development

### Local Development

```bash
# Run without Docker (requires Go 1.21+)
cd service
go mod tidy
go run main.go

# Build binary
go build -o bin/service main.go
```

### Adding New Features

1. **Controllers** → `service/internal/handlers/`
2. **Business Logic** → `service/internal/services/`
3. **Data Access** → `service/internal/repositories/`
4. **Models** → `service/internal/models/`
5. **Routes** → `service/internal/routes/`

## 📊 Monitoring & Observability

### Grafana Dashboards

- **service Metrics** - Request rates, response times, error rates
- **System Metrics** - CPU, Memory, Disk usage
- **Business Metrics** - User registrations, file uploads, storage usage

### Log Queries (Loki)

```logql
# View service logs
{compose_service="service-api"}

# Filter error logs
{compose_service="service-api"} |= "ERROR"

# View specific operation
{compose_service="service-api"} |= "LoginUser"
```

## 🚀 Future Enhancements & Roadmap

### 💳 Payment Integration
- [ ] Stripe/PayPal payment gateway
- [ ] Subscription management
- [ ] Billing history and invoices
- [ ] Usage-based pricing tiers

### 🔄 Advanced Features
- [ ] File versioning and history
- [ ] Real-time file collaboration
- [ ] Advanced file search and tagging
- [ ] Automated file compression/optimization
- [ ] CDN integration for faster downloads
- [ ] Mobile app (React Native/Flutter)

### 🏗️ Infrastructure & Scalability
- [ ] **Kubernetes deployment** with Helm charts
- [ ] **Multi-region deployment** for global availability
- [ ] **Auto-scaling** based on CPU/memory metrics
- [ ] **Redis caching** for session management
- [ ] **Message queues** (RabbitMQ/Apache Kafka) for async processing
- [ ] **Load balancing** with NGINX/HAProxy

### 🛡️ Security Enhancements
- [ ] **OAuth2/SSO** integration (Google, GitHub, Microsoft)
- [ ] **Two-factor authentication** (2FA)
- [ ] **End-to-end encryption** for sensitive files
- [ ] **Audit logging** for compliance
- [ ] **Vulnerability scanning** in CI/CD pipeline
- [ ] **API rate limiting** per user/plan

### 📊 Analytics & Intelligence
- [ ] **Machine learning** for file categorization
- [ ] **Usage analytics dashboard** for users
- [ ] **Predictive storage planning**
- [ ] **Advanced reporting** and exports
- [ ] **Real-time notifications** for file changes

### 🔧 DevOps & Operations
- [ ] **CI/CD pipeline** with GitHub Actions/GitLab CI
- [ ] **Infrastructure as Code** (Terraform/Pulumi)
- [ ] **Automated testing** (unit, integration, e2e)
- [ ] **Blue-green deployments**
- [ ] **Disaster recovery** and backup strategies
- [ ] **Performance testing** and optimization

### 🌐 Multi-tenancy & Enterprise
- [ ] **Multi-tenant architecture**
- [ ] **Admin dashboard** for user management
- [ ] **Team/organization** features
- [ ] **Role-based access control** (RBAC)
- [ ] **API rate limiting** per tenant
- [ ] **White-label solutions**

### Code Standards

- Follow Go best practices and conventions
- Add comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Course Instructor:**  
I Gede Mujiyatna - Cloud Computing KOM