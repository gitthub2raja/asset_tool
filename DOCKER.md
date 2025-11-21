# Docker Deployment Guide

## Quick Start

### Production Build

**If you get port conflicts, first run:**
```bash
npm run docker:cleanup
# OR
./docker-cleanup.sh
```

1. **Build and start containers**:
   ```bash
   docker-compose up --build
   ```

2. **Run in background**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Alternative Ports (If 5000/3000 are in use)

If ports 5000 or 3000 are already in use, use alternative ports:

```bash
npm run docker:alt
# OR
docker-compose -f docker-compose.alt.yml up --build
```

This will use:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/api

### Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Available Commands

### Using npm scripts:
```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:dev      # Start in development mode
npm run docker:logs     # View container logs
```

### Using docker-compose directly:
```bash
docker-compose up              # Start containers
docker-compose up -d           # Start in detached mode
docker-compose down            # Stop and remove containers
docker-compose down -v         # Stop and remove containers + volumes (clears database)
docker-compose build           # Build images
docker-compose logs -f         # Follow logs
docker-compose ps              # List running containers
docker-compose restart         # Restart containers
```

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-strong-secret-key-change-this-in-production
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## Database Persistence

The database is stored in a Docker volume. Data persists between container restarts.

To reset the database:
```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Port conflicts

**Option 1: Clean up existing containers/processes**
```bash
npm run docker:cleanup
# OR
./docker-cleanup.sh
```

**Option 2: Use alternative ports**
```bash
npm run docker:alt
# OR
docker-compose -f docker-compose.alt.yml up --build
```

**Option 3: Manually change ports in docker-compose.yml**
```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
  - "5001:5000"  # Change 5000 to 5001
```
Don't forget to update `REACT_APP_API_URL` in the frontend build args to match!

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute commands in container
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Clean up

**Quick cleanup script:**
```bash
npm run docker:cleanup
# OR
./docker-cleanup.sh
```

**Manual cleanup:**
```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup (containers, volumes, images)
docker-compose down -v --rmi all

# Kill processes on ports
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

## Architecture

- **Backend**: Node.js/Express server running on port 5000
- **Frontend**: React app served via Nginx on port 80 (mapped to 3000)
- **Database**: SQLite stored in Docker volume
- **Network**: Bridge network for inter-container communication

## Production Considerations

1. **Change JWT_SECRET**: Use a strong, random secret key
2. **Use HTTPS**: Configure reverse proxy (nginx/traefik) with SSL
3. **Database**: Consider migrating to PostgreSQL or MySQL for production
4. **Environment**: Set NODE_ENV=production
5. **Resource limits**: Add resource limits in docker-compose.yml
6. **Backup**: Implement database backup strategy

