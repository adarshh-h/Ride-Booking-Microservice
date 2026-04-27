# Ride-Booking Microservice

A scalable, distributed microservice architecture for a ride-booking application built with Node.js, Express, and MongoDB.

## 📋 Project Overview

This project implements a ride-booking system using microservices architecture with the following key components:
- **User Service**: Manages user registration, authentication, and profile management
- **Captain Service**: Handles captain/driver registration, authentication, and information
- **Ride Service**: Manages ride creation, tracking, and ride-related operations
- **API Gateway**: Central entry point that routes requests to appropriate microservices

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB Atlas
- **Message Queue**: RabbitMQ (CloudAMQP)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcrypt
- **HTTP Client**: Axios

### Services Communication
Services communicate asynchronously through RabbitMQ message broker for decoupled, scalable operations.

### Directory Structure
```
Ride-Booking-Microservice/
├── gateway/                 # API Gateway - Routes requests to services
│   ├── app.js
│   └── package.json
├── user/                    # User Service
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   ├── service/
│   └── package.json
├── captain/                 # Captain/Driver Service
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   ├── service/
│   └── package.json
├── ride/                    # Ride Service
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   ├── service/
│   └── package.json
└── README.md
```

## 🚀 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- RabbitMQ (CloudAMQP account or local installation)
- Git

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ride-Booking-Microservice
```

### 2. Install Dependencies for All Services

**User Service**
```bash
cd user
npm install
```

**Captain Service**
```bash
cd ../captain
npm install
```

**Ride Service**
```bash
cd ../ride
npm install
```

**Gateway Service**
```bash
cd ../gateway
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in each service directory based on the `.env.sample` template.

#### Required Environment Variables:

**All Services:**
```
MONGO_URI=<Your MongoDB Atlas connection string>
JWT_SECRET=<Your JWT secret key>
RABBITMQ_URL=<Your RabbitMQ connection string>
```

**Example (User Service):**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/userDB?ssl=true
JWT_SECRET=your_jwt_secret_key
RABBITMQ_URL=amqps://username:password@host.cloudamqp.com/vhost
```

### MongoDB Setup
- Create separate databases for each service (userDB, captainDB, uberRide)
- Each service manages its own data models

### RabbitMQ Setup
- Set up a CloudAMQP instance or use local RabbitMQ
- All services share the same RabbitMQ connection for inter-service communication

## 🎯 Running the Application

### Development Mode (with auto-reload)

**User Service**
```bash
cd user
npm run dev
```

**Captain Service**
```bash
cd captain
npm run dev
```

**Ride Service**
```bash
cd ride
npm run dev
```

**Gateway Service**
```bash
cd gateway
npm run dev
```

### Production Mode

**User Service**
```bash
cd user
npm start
```

**Captain Service**
```bash
cd captain
npm start
```

**Ride Service**
```bash
cd ride
npm start
```

**Gateway Service**
```bash
cd gateway
npm start
```

### Running All Services Concurrently

You can use a process manager like `pm2` or run each service in a separate terminal.

**Using PM2:**
```bash
npm install -g pm2

pm2 start user/server.js --name "user-service"
pm2 start captain/server.js --name "captain-service"
pm2 start ride/server.js --name "ride-service"
pm2 start gateway/app.js --name "gateway"

pm2 logs
```

## 🔑 Key Features

### User Service
- User registration and authentication
- Profile management
- JWT-based session management
- Token blacklisting for logout functionality
- Password hashing with bcrypt

### Captain Service
- Captain/Driver registration and authentication
- Captain profile and verification
- Token blacklisting for logout
- Role-based operations

### Ride Service
- Create and manage ride bookings
- Ride tracking and status updates
- Integration with user and captain services
- Async messaging for ride notifications

### API Gateway
- Single entry point for all client requests
- Request routing to appropriate microservices
- HTTP proxy for service-to-service communication
- Cross-Origin Resource Sharing (CORS) support

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt for password hashing
- **Token Blacklisting**: Logout functionality with token invalidation
- **CORS**: Cross-origin request handling
- **Environment Variables**: Sensitive data management through .env files

## 📡 API Communication

### Services communicate via:
1. **REST API Calls** (through gateway)
2. **Asynchronous Messaging** (through RabbitMQ for notifications and events)

### Middleware
- Authentication middleware for JWT verification
- Morgan for HTTP request logging
- Cookie parser for session management

## 🛠️ Development

### Dependencies Overview

**Common Dependencies Across Services:**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `amqplib`: RabbitMQ client
- `jsonwebtoken`: JWT handling
- `bcrypt`: Password encryption
- `dotenv`: Environment variable management
- `nodemon`: Development server with auto-reload
- `morgan`: HTTP logging

**Additional Dependencies:**
- `express-http-proxy`: Used by gateway for request routing
- `axios`: Used by ride service for HTTP calls

## 📝 Available Scripts

In each service directory:
- `npm start`: Run the service in production mode
- `npm run dev`: Run the service in development mode with auto-reload
- `npm test`: Run tests (currently not configured)

## 🐛 Troubleshooting

### Connection Issues
- Verify MongoDB URI is correct and accessible
- Ensure RabbitMQ URL is valid and connection is active
- Check JWT_SECRET is set properly

### Port Conflicts
- Ensure all required ports are available
- Modify port configurations in service files if needed

### Missing Environment Variables
- Check all `.env` files have required variables
- Copy from `.env.sample` and update with actual values

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [JWT.io](https://jwt.io/)

## 📄 License

ISC

## 👤 Author

Adarsh Kumar Gupta

---

**Note**: This is a microservice-based architecture. Ensure all services are running for the application to function correctly. Start services in any order, but the gateway should be accessible as the primary entry point.
