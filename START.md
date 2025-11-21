# Quick Start Guide

## Starting the Application

Since port 80 requires root privileges, you need to run Docker with `sudo`:

### Option 1: Using docker-compose (if installed)
```bash
sudo docker-compose up --build
```

### Option 2: Using docker compose (Docker Compose V2)
```bash
sudo docker compose up --build
```

### Option 3: Run in background (detached mode)
```bash
sudo docker compose up --build -d
```

## After Starting

Once containers are running, access the application at:
- **Frontend**: `http://localhost` or `http://your-ip-address`
- **API**: `http://localhost/api`

## Default Login Credentials

- **Admin**: `admin` / `admin123`
- **Technician**: `technician` / `tech123`

## Useful Commands

```bash
# View logs
sudo docker compose logs -f

# Stop containers
sudo docker compose down

# Restart containers
sudo docker compose restart

# View running containers
sudo docker ps
```

## Troubleshooting

If you get permission errors, make sure you're using `sudo` or add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Then logout and login again
```

