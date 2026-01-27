# ASTU Food Delivery System

A full-stack food delivery system built as a project for ASTU. The application is implemented primarily Next.js and Express.js. It provides functionality for browsing restaurants and menus, placing orders, and managing deliveries.

## Features

- Browse restaurants and menus
- User authentication (sign up / sign in)
- Place and track orders
- Admin dashboard for managing users, restaurant and the system
- Restaurant dashboard for managin a restaurant,menu, driver and orders
- Responsive web frontend and RESTful backend APIs

## Tech stack

- Language: TypeScript (primary), JavaScript
- Frontend: Next.js + TypeScript
- Backend: Node.js + TypeScript (Express or similar)
- Database: MongoDB

## Getting started

These are general steps to run the project locally. Adjust commands to match the repository's exact scripts and folder layout.

1. Clone the repository

   git clone https://github.com/YonasAdane/ASTU-food-delivery-system.git
   cd ASTU-food-delivery-system
   cd cliet for the frontend or
   cd server for the backend

2. Install dependencies

   npm install
   # or
   yarn install

3. Configure environment

Create a `.env` file in the project root (or backend/frontend folders) and set the required environment variables. Common variables:
for client
NEXT_PUBLIC_API_URL
for server
MONGO_URI="mongodb://localhost:27017/capstone-delivery"
CLIENT_URL
JWT_SECRET
JWT_REFRESH_SECRET
REDIS_URL
EMAIL_USER
EMAIL_PASS

4. Build (if TypeScript needs compilation)

   npm run build

5. Run locally

   npm start
   # or for development with live reload
   npm run dev

6. Run tests (if available)

   npm test

## Project structure

- /server - server-side code (TypeScript)
- /client - client-side code (TypeScript, HTML, CSS)


Adjust folders above to match this repository's layout.

## Contributing

Contributions are welcome. Please open an issue to discuss major changes and follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/my-feature)
3. Commit your changes and push to your branch
4. Open a pull request describing your changes

## Notes

This README provides a starting point. Update installation steps, scripts, and configuration details to match the repository's actual code and folder layout.
