# HH+ Hackathon Project

HH+ is a hackathon project built with React, Vite, Firebase, and Tailwind CSS. The app connects volunteers, NGOs, and community members to request and manage help across local communities.

## Key Features

- User authentication with Firebase
- Volunteer dashboard for managing task assignments
- NGO dashboard for posting and managing requests
- Community request flow for users to request help
- Map integration for locating nearby volunteers or help resources
- Role-based pages: volunteer, NGO, community

## Project Structure

- `frontend/` - React/Vite frontend application
- `frontend/src/components/` - Reusable UI components like navigation and map view
- `frontend/src/pages/` - App pages including auth, community, NGO, and volunteer sections
- `frontend/src/services/` - API-style service modules for requests, users, volunteers, and assignments
- `frontend/src/context/` - Authentication context provider
- `frontend/src/hooks/` - Custom hooks for auth and data fetching
- `frontend/src/config/` - Firebase configuration module
- `frontend/public/` - Static assets

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Firebase
- React Router DOM
- ESLint

## Setup & Run

1. Open the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL shown in the terminal.

## Build

```bash
cd frontend
npm run build
```

## Notes

- This project was created for a hackathon.
- Firebase configuration is stored in `frontend/src/config/firebase.config.js`.
- Customize any Firebase or app-specific settings before deploying.

## License

This repository is intended for hackathon development and demonstration purposes.
