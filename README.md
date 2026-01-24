# ASTU Food Delivery System

A full-stack food delivery system built as a project for ASTU. The application is implemented primarily in TypeScript with supporting JavaScript, HTML, and CSS. It provides functionality for browsing restaurants and menus, placing orders, and managing deliveries.

## Features

- Browse restaurants and menus
- User authentication (sign up / sign in)
- Place and track orders
- Admin dashboard for managing restaurants, menus, and orders
- Responsive web frontend and RESTful backend APIs

## Tech stack

- Language: TypeScript (primary), JavaScript
- Frontend: HTML, CSS, TypeScript
- Backend: Node.js + TypeScript (Express or similar)
- Database: (e.g., PostgreSQL, MongoDB) — configure in environment variables

## Getting started

These are general steps to run the project locally. Adjust commands to match the repository's exact scripts and folder layout.

1. Clone the repository

   git clone https://github.com/YonasAdane/ASTU-food-delivery-system.git
   cd ASTU-food-delivery-system

2. Install dependencies

   npm install
   # or
   yarn install

3. Configure environment

Create a `.env` file in the project root (or backend/frontend folders) and set the required environment variables. Common variables:

- DATABASE_URL or DB_HOST, DB_USER, DB_PASS
- JWT_SECRET
- PORT

4. Build (if TypeScript needs compilation)

   npm run build

5. Run locally

   npm start
   # or for development with live reload
   npm run dev

6. Run tests (if available)

   npm test

## Project structure (typical)

- /backend - server-side code (TypeScript)
- /frontend - client-side code (TypeScript, HTML, CSS)
- /scripts - build or deployment scripts

Adjust folders above to match this repository's layout.

## Contributing

Contributions are welcome. Please open an issue to discuss major changes and follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/my-feature)
3. Commit your changes and push to your branch
4. Open a pull request describing your changes

## License

Specify a license for the project (e.g., MIT). If none is chosen, add one to the repository.

## Notes

This README provides a starting point. Update installation steps, scripts, and configuration details to match the repository's actual code and folder layout.
