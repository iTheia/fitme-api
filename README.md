# FitMe API

## Overview
This API powers an app designed to foster private exercise communities. Users can create private groups to track their fitness progress, share achievements, and support one another. The app includes built-in exercise routines to guide users, with the flexibility for users to create and share their own custom routines. It promotes a collaborative and personalized fitness experience, making it easy for individuals to stay motivated and achieve their goals within a supportive group environment.

## Features

- **User Authentication:** Provides secure user authentication using JWT.
- **Exercise Module:** Handles exercise-related functionalities.
- **Health Check:** Offers endpoint(s) to monitor the health of the service.
- **Notification Module:** Manages notifications for the users.
- **Redis Integration:** Caching mechanism using Redis for improved performance.
- **Swagger API Documentation:** Automatically generated documentation for all API endpoints.
- **Cron Jobs:** Scheduled tasks handled through NestJS's scheduling module.
- **Google OAuth:** Google-based authentication support.

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development, if not using Docker)

## Installation

### Using Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fitme-api.git
   cd fitme-api
   ```
2. Build and run the containers:
``` bash
docker-compose up --build
```
This will start all the necessary services, including the API, Redis, and MongoDB.

3. Access the application at:
Web
```
http://localhost:3000
```
