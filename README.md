# Feedback & Suggestions Platform

A simple feedback form where anyone can file feedback and track it later with a ticket number. No accounts, no voting, no comments.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **MongoDB** with Mongoose (NoSQL)
- **Tailwind CSS 4**

## Getting started

### 1. Start MongoDB

MongoDB must be running locally. Either:

- **Windows service (current setup):** MongoDB Community was installed via winget and runs as the `MongoDB` service.
- **Docker:** `docker compose up -d` (a `docker-compose.yml` is included).

The default connection string is `mongodb://localhost:27017/feedback-platform` (set in `.env.local`, gitignored).

### 2. Install, seed, run

```bash
npm install
npm run seed      # drops and reseeds sample tickets (FB-DEMO01..FB-DEMO04)
npm run dev       # http://localhost:3000
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with two buttons: **File a feedback** and **Track a ticket** |
| `/file` | Submit feedback. On success you get a ticket number (e.g. `FB-7K2M9A`) |
| `/track` | Enter a ticket number |
| `/track/[ticket]` | Full ticket view: title, description, category, status, submitted date |

## Data model

- **Feedback** — ticketNumber (unique, e.g. `FB-XXXXXX`), title, description, category (`feature`/`bug`/`general`), status (`open`/`planned`/`in-progress`/`done`, default `open`)

Status is stored but nothing changes it yet — it always starts as `open`. That's where an admin/reply feature can plug in later.

## Scripts

- `npm run lint` — ESLint
- `npm run build` — production build + typecheck
- `npm run seed` — reset database and insert sample tickets

## Deploying later (Cloudflare)

Swap `MONGODB_URI` to a MongoDB Atlas connection string (the native MongoDB driver is compatible with Workers). No code changes required.
