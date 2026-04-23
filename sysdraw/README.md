# SysDraw — Online Design Tool & CASE Platform

A browser-based UML diagramming tool with drag-and-drop canvas, multi-diagram support, and code export. Built with React.js + Node.js following MVC architecture.

## Features
- Auth: Register / Login with JWT
- Canvas: Fabric.js drag-and-drop diagram canvas  
- UML Shapes: Class, Use Case, Sequence, Activity diagrams
- Multi-page: Add multiple pages per project
- Undo/Redo: Full history (50 states)
- Auto-save: Saves diagram JSON to backend every 30s
- Export: Generate SQL Schema, Java code, Python code
- Context Menu: Right-click: duplicate, delete, reorder
- Properties Panel: Click element to edit label, color, position

## Setup

### Prerequisites
- Node.js >= 16, npm >= 8

### Install All Dependencies
```bash
cd sysdraw
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Run Development (both client + server)
```bash
npm run dev
```
- API Server → http://localhost:5000
- React App → http://localhost:3000

### First Use
1. Register an account at http://localhost:3000/register
2. Click + New Project → select diagram type
3. Drag shapes from left panel onto canvas
4. Right-click shapes for context menu
5. Click shape to open Properties panel
6. Click Export to generate SQL / Java / Python

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login → JWT |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/diagrams/:pid/pages/:pgid | Load diagram |
| POST | /api/diagrams/:pid/pages/:pgid/save | Save diagram |
| POST | /api/diagrams/:pid/export | Export code |

## Architecture (MVC)
- View: React components + AppContext + api.js
- Controller: Express routes + controllers + middleware
- Model: User.js / Project.js → JSON flat files

## Tech Stack
- Frontend: React 18, React Router 6, Fabric.js 5, Axios
- Backend: Node.js, Express 4, bcryptjs, jsonwebtoken
- Storage: JSON flat files (no external DB required)
- Fonts: DM Sans + Space Mono
