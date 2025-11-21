# IT Asset Management Tool

A modern, cybersecurity-themed IT Asset Management system inspired by GLPI, featuring animated design elements and role-based access control.

## Features

- 🔒 **Cybersecurity Theme**: Modern, animated UI with cyber-themed design elements
- 👥 **Role-Based Access**: Admin and Technician roles with different permissions
- 📊 **Real-Time Updates**: Automatic asset synchronization every 5 seconds
- 🎨 **Animated Interface**: Smooth animations and transitions using Framer Motion
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔐 **Secure Authentication**: JWT-based authentication system
- 📈 **Statistics Dashboard**: Real-time asset statistics and overview

## User Roles

### Admin
- Full access to all features
- Create, read, update, and **delete** assets
- View all statistics

### Technician
- Create, read, and update assets
- **Cannot delete** assets
- View all statistics
- Real-time access to asset data

## Default Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **Technician**: 
  - Username: `technician`
  - Password: `tech123`

## Installation

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **If ports 3000 or 5000 are in use**, free them first:
   ```bash
   ./kill-ports.sh
   # OR manually:
   # lsof -ti:5000 | xargs kill -9
   # lsof -ti:3000 | xargs kill -9
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend React app (port 3000).

   **Alternative**: If ports are still in use, use alternative ports:
   ```bash
   npm run dev:alt
   ```
   This uses ports 5001 (backend) and 3001 (frontend).

## Docker Deployment (Single Port 80)

### Quick Start

**Note**: Port 80 requires root privileges. You may need to use `sudo` or run as root.

1. **Build and start containers**:
   ```bash
   sudo docker-compose up --build
   ```

2. **Run in background**:
   ```bash
   sudo docker-compose up -d --build
   ```

3. **Access the application**:
   - Frontend: `http://localhost` or `http://your-ip-address`
   - Backend API: `http://localhost/api` (proxied through nginx)

### Architecture

- **Frontend**: Served via Nginx on port 80
- **Backend API**: Accessible at `/api` (proxied through nginx)
- **Backend Container**: Only exposed internally (not mapped to host)
- **Single Port**: Everything accessible through port 80

### Docker Commands

```bash
# Start containers
sudo docker-compose up --build

# Stop containers
sudo docker-compose down

# View logs
sudo docker-compose logs -f

# Rebuild after code changes
sudo docker-compose up --build
```

## Project Structure

```
asset_tool/
├── server/                 # Backend Express server
│   ├── database/          # Database initialization
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context (Auth)
│   │   └── App.js        # Main app component
│   └── public/
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/register` - Register new user (optional)

### Assets
- `GET /api/assets` - Get all assets (with optional search/filter)
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset (Admin only)
- `GET /api/assets/stats/overview` - Get asset statistics

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs
- express-validator

### Frontend
- React
- React Router
- Framer Motion (animations)
- Axios (HTTP client)
- CSS3 (custom cybersecurity theme)

## Database

The application uses SQLite for simplicity. The database file is created automatically at `server/database/assets.db` on first run.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation
- SQL injection protection

## Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`
- API base URL can be configured via `REACT_APP_API_URL` environment variable

## Troubleshooting

### Port Already in Use

If you get `EADDRINUSE` errors:

1. **Use the kill script**:
   ```bash
   ./kill-ports.sh
   ```

2. **Or use alternative ports**:
   ```bash
   npm run dev:alt
   ```

3. **Or manually find and kill processes**:
   ```bash
   # Find process on port 5000
   lsof -ti:5000
   # Kill it
   lsof -ti:5000 | xargs kill -9
   
   # Same for port 3000
   lsof -ti:3000 | xargs kill -9
   ```

### Docker Port 80 Permission Issues

If you get permission errors when binding to port 80:

1. **Use sudo**:
   ```bash
   sudo docker-compose up --build
   ```

2. **Or add your user to docker group** (requires logout/login):
   ```bash
   sudo usermod -aG docker $USER
   ```

3. **Or use a different port** (modify docker-compose.yml):
   ```yaml
   ports:
     - "8080:80"  # Use port 8080 instead
   ```

## Production Build

To create a production build:

```bash
npm run build
```

This will create an optimized production build in `client/build/`.

## License

MIT
