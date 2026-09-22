# DevTrack AI

DevTrack AI is an AI-powered developer productivity and learning platform built with the MERN stack.

## Project Structure

- `client/` - React frontend (to be initialized in a later step)
- `server/` - Node.js and Express backend (to be initialized in a later step)

## Setup

The root project runs the React frontend and Express backend together with `concurrently`.

Install all dependencies from the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Start both applications with either command:

```bash
npm run dev
npm start
```

The frontend is available at `http://localhost:5173` and the backend health check is at `http://localhost:5000/api/health`.
