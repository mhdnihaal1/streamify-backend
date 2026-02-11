                             Chat App Project

# This is a real-time Chat Application built with React (Vite) on the frontend and Node.js + Express on the backend. It uses PostgreSQL for database storage, hosted online with Supabase, and implements real-time updates using polling and Socket.IO.


![Supabase](https://supabase.com/dashboard/project/uxrdcyeflfixgrtxxqof/editor/17599?schema=public)


                         Chat Functionality

# Real-time messaging between users in groups.

# Users can see messages as they are sent without refreshing.

# Admins can manage group members and roles.

                          Admin Features

# Admins can create organizations.

# Each organization can have multiple groups.

# Admins can add users to groups and assign them as Admin or User.

# Admins can remove users from groups.

# Admins can see all group members in the chat bar (top human icon) and manage permissions.

                         User Features

# Users can join groups they are added to.

# Users can chat in real-time with group members.

# Users see the list of members in the group.


              Tech Stack

# Layer	                           Technology

# Frontend                   	React.js (Vite), Tailwind CSS
# Backend	                    Node.js, Express.js, Socket.IO
# Database	                    PostgreSQL (Supabase hosted)
# Real-time                     Socket.IO for chat, polling for database sync
# Authentication          	    JWT + httpOnly cookies


                  Frontend

# Navigate to the frontend folder:    cd frontend

# Install dependencies:               npm install

# Start the development server:       npm run dev

# Build for production:               npm run build

# Preview the production build:       npm run preview


                  Backend

# Navigate to the backend folder:     cd backend

# Install dependencies:               npm install

# Start the server:                   npm run dev

# The server will run on http://localhost:3000.



              Folder Structure

chat-app/
├─ frontend/          # React Vite frontend
│  ├─ src/
│  │  ├─ components/  # Reusable UI components
│  │  ├─ pages/       # Login, Signup, Home, Layout
│  │  ├─ hooks/       # Custom hooks (e.g., useAuthUser)
│  │  ├─ service/     # Axios API setup
│  │  └─ App.jsx      # Main app component
│  └─ package.json
├─ backend/           # Node.js + Express backend
│  ├─ auth/           # Authentication routes and controllers
│  ├─ users/          # User routes
│  ├─ groups/         # Group routes
│  ├─ utils/          # Helper functions (e.g., parseTokenFromCookie)
│  ├─ app.ts          # Express app setup
│  ├─ server.ts       # HTTP & Socket.IO server
│  └─ package.json
└─ README.md
