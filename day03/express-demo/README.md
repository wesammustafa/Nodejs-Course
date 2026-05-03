# Express Demo (TypeScript)

A minimal Express server in TypeScript demonstrating how a CPU-bound handler
blocks the Node.js event loop and stalls all other requests on the same process.

## Project structure

```
express-demo/
├── package.json
├── tsconfig.json
└── src/
    └── server.ts
```

## Install

```bash
cd express-demo
npm install
```

## Run

Development (no build step, runs TS directly):

```bash
npm run dev
```

Production-style (compile, then run):

```bash
npm run build
npm start
```

The server listens on `http://localhost:3000` (override with `PORT` env var).

## Endpoints

- `GET /fast` — returns immediately.
- `GET /slow` — busy-waits for 5 seconds, blocking the event loop for the
  entire duration.

## Try it

In one terminal:

```bash
curl http://localhost:3000/slow
```

In another terminal, immediately after:

```bash
curl http://localhost:3000/fast
```

The `/fast` request will not return until `/slow` has finished — that is the
event-loop block in action. This is why CPU-bound work belongs in a worker
thread, a child process, or a separate service.
