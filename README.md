# React Admin Dashboard

# RBAC Demo

A demo video of the project.

![RBAC Demo Preview](https://github.com/kadirikumar-uptycs/RBAC/blob/master/Kadiri-RBAC.gif)

To view the full video, [click here](https://github.com/kadirikumar-uptycs/RBAC/blob/master/Kadiri-RBAC.mp4).


## Features

### Authentication and Role-Based Access Control
- Multi-role authentication system with different access levels:
  - SuperAdmin: Full system access
  - Admin: User management 
  - Manager: Team view
  - Standard User: Dashboard access

### Role-Specific Navigation
Each user role has a customized sidebar with role-appropriate routes:
- SuperAdmin: 
  - Dashboard
  - User Management
  - Role Management
- Admin:
  - Dashboard
  - User Management
- Manager:
  - Dashboard
  - Team View
- Standard User:
  - Dashboard only

### UI/UX Features
- Dark mode theme
- Responsive sidebar with open/close functionality
- Animated page transitions
- Hover and tap interactions on sidebar items
- Material UI components
- Framer Motion for smooth animations

## Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- Git

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/kadirikumar-uptycs/RBAC.git
cd RBAC
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm start
# or
yarn start
```

4. Open `http://localhost:3000` in your browser

## Production Build

```bash
npm run build
# or
yarn build
```

## Key Dependencies
- React Router (routing)
- Material-UI (components)
- Framer Motion (animations)
- Context API (state management)

## Authentication Flow
1. User logs in with one of the role
2. Sidebar and routes dynamically adjust based on user role

## Security
- Protected routes prevent unauthorized access
- Role-based navigation restricts UI elements
- Redirects handle unauthorized attempts to access protected routes
