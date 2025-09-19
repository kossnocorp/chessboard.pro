# Game Prototype Plan

## Brief Spec

- Build a `chessboard_pro_game` Cloudflare Worker crate backed by Durable Objects with SQLite storage, using the `chess` crate for move validation and game state transitions.
- Support invitation-driven match setup with random side assignment, time controls, voice announcements, draw/offline handling, clocks, and persistent history that anyone can review.
- Integrate with the Next.js frontend to create games, manage lobby transitions, play moves over WebSockets, and render clocks, board state, and move history with keyboard/voice affordances.

## Plan

1. [Worker Scaffold & Architecture](./01-worker-scaffold.md) — establish the Rust worker crate, wrangler configuration, Durable Object bindings, shared type contracts, and build tooling (incl. type generation) for multi-package integration.
2. [Game Logic & Storage](./02-game-logic.md) — design the Durable Object schema, lifecycle finite state machine, token issuance/validation, time-control calculations, and persistence rules for history, clocks, and abandonment.
3. [Realtime API Surface](./03-realtime-api.md) — specify HTTP endpoints and WebSocket protocol for creation, lobby updates, move submission, state sync, voice cues, and spectator access (including auth via tokens).
4. [Web UI Integration](./04-web-ui.md) — map UI flows for `/game/new` and `/game/[id]`, reuse the board component, wire token handling, clocks, history navigation, voice, and invitation UX across server/client components.

## TODO

- [ ] [Worker Scaffold & Architecture](./01-worker-scaffold.md)
- [ ] [Game Logic & Storage](./02-game-logic.md)
- [ ] [Realtime API Surface](./03-realtime-api.md)
- [ ] [Web UI Integration](./04-web-ui.md)
