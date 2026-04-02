# CLAUDE.md

## Project

**brianure.com** — Brian Ure's personal brand website and client-facing service platform.

## Goal

The site serves as Brian's professional home on the web. It communicates who he is, the kind of work he does, who he does it for, and the values that guide him. It showcases his strongest professional experiences and gives prospective clients a way to discover and book his services directly.

## About Brian

Brian Ure is a senior full stack software developer specializing in Next.js. This site is both a reflection of his craft and a working example of it.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase |
| Payments | Stripe |
| Hosting | Vercel |

## Working in This Codebase

- **Read [DOCS.md](./DOCS.md) before making any changes.** It is the index to all coding standards, skill docs, and architecture documentation.
- Each aspect of the app has a dedicated skill doc (frontend design, business logic, edge functions, code review). Read the relevant one before working in that area.
- This is a personal brand site — tone, design decisions, and copy choices should reflect Brian's voice and professionalism.
- Stripe integration is the backbone of the services flow; handle it carefully and always test against Stripe's test environment before touching anything in production.
- **No AI attribution in commits.** See coding standards for details.
