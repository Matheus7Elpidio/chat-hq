# IT Support System - Chat & Dashboard

## Overview

This is a comprehensive IT support system featuring real-time chat capabilities, role-based dashboards, and administrative tools. The application serves four distinct user roles: clients, agents, supervisors, and administrators, each with tailored interfaces and functionality. The system enables seamless communication between clients and support staff while providing monitoring and management tools for supervisors and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: React Router v6 with role-based route protection and conditional navigation
- **State Management**: React Query (TanStack Query) for server state management with real-time data synchronization
- **UI Framework**: Shadcn/UI components built on Radix UI primitives with Tailwind CSS for styling
- **Real-time Communication**: Socket.IO client for WebSocket connections enabling live chat and notifications
- **Authentication**: Context-based authentication with JWT token management and automatic token refresh

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: SQLite with Knex.js query builder for database operations and migrations
- **Real-time Features**: Socket.IO server for WebSocket connections supporting chat rooms and agent status tracking
- **Authentication**: JWT-based authentication with role-based access control
- **API Design**: RESTful endpoints with role-specific route protection

### Role-Based Access System
The application implements a comprehensive role hierarchy:
- **Client**: Access to sector selection and chat interface
- **Agent**: Chat system with transfer capabilities and basic dashboard
- **Supervisor**: Agent monitoring, chat history, and real-time oversight tools
- **Administrator**: Full system access including user management and analytics

### Data Storage Solutions
- **Primary Database**: SQLite for lightweight deployment with support for user management, chat history, and system metrics
- **Session Management**: JWT tokens stored in localStorage with automatic expiration handling
- **Real-time Data**: In-memory socket management for active connections and chat room state

### Authentication and Authorization
- **Token-Based Authentication**: JWT tokens with role-based claims for secure API access
- **Route Protection**: Frontend route guards based on user roles with automatic redirects
- **API Security**: Bearer token authentication for all protected endpoints with role validation

### Chat System Design
- **Multi-Room Support**: Dynamic chat room creation based on client-agent pairings
- **Message Types**: Support for regular messages, system events, and supervisor interventions
- **Transfer Functionality**: Ability to transfer chats between agents or sectors with notification system
- **Real-time Updates**: Live message delivery, typing indicators, and presence status

## External Dependencies

### Core Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Accessible UI primitive components for dialogs, dropdowns, and form controls
- **socket.io-client**: WebSocket client for real-time communication
- **react-router-dom**: Client-side routing with nested route support
- **react-hook-form**: Form validation and state management
- **date-fns**: Date formatting and manipulation utilities

### Backend Dependencies
- **express**: Web application framework with middleware support
- **socket.io**: WebSocket server implementation for real-time features
- **jsonwebtoken**: JWT token creation and verification
- **bcryptjs**: Password hashing and validation
- **knex**: SQL query builder with migration support
- **sqlite3**: Embedded database engine
- **cors**: Cross-origin resource sharing middleware

### Development and Build Tools
- **vite**: Fast build tool with hot module replacement and development server
- **typescript**: Type safety and enhanced development experience
- **tailwindcss**: Utility-first CSS framework with custom design system
- **eslint**: Code linting with React and TypeScript configurations
- **postcss**: CSS processing with Tailwind integration

### UI and Styling Dependencies
- **class-variance-authority**: Component variant management for consistent styling
- **clsx**: Conditional className utility for dynamic styling
- **lucide-react**: Consistent icon library with extensive symbol coverage
- **embla-carousel-react**: Carousel component for dashboard widgets
- **cmdk**: Command palette functionality for quick navigation