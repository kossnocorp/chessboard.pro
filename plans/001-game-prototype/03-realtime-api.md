# Realtime API Surface

## Objectives

- Define HTTP + WebSocket interfaces for creating games, joining with tokens, streaming state updates, and allowing spectators to observe.
- Ensure secure token-based access control with minimal exposure of secret data while enabling invitation flows.
- Provide message schemas that encode board state, clocks, history, and voice cues for both initiator and opponent clients.

## Interfaces

- **POST `/api/game`** (Next.js server action or Route Handler): accepts time-control payload, calls Worker to create Durable Object, returns `{ gameId, initiatorToken, invitationToken, side, initialState }`.
- **Durable Object Id-based Routes**: e.g. `/games/:id/create`, `/games/:id/join`, `/games/:id/ws`. Use `workers-rs` routing (e.g. `Router`) to map HTTP + WebSocket upgrades.
- **WebSocket Endpoints**:
  - `ws://worker/games/:id/connect?token=...&role=player|spectator` for players/spectators.
  - `ws://worker/games/:id/invite?token=...` to redeem invitation and receive opponent token.

## Message Schema

- Standard envelope `{ type, correlationId?, issuedAt, payload }`.
- **Server → Client Events**:
  - `state.sync`: full game snapshot (board FEN, moves, clocks, status, players).
  - `state.update`: incremental updates on move, draw offer, resignation, timeout.
  - `lobby.waiting`: invitation info & shareable link.
  - `token.assigned`: opponent token delivered after invitation redemption.
  - `clock.tick`: periodic clock updates or drift corrections.
  - `voice.queue`: textual payload clients should vocalize.
  - `error`: fatal or recoverable error messages.
- **Client → Server Commands**:
  - `move.play { token, san|uci, promotion? }`.
  - `clock.pause/resume` if future features require.
  - `game.accept { invitationToken }`.
  - `game.draw.offer`, `game.draw.respond { accepted }`.
  - `game.resign`.
  - `presence.heartbeat` to keep connection alive.
  - `spectator.subscribe` for read-only clients (no token needed, but limited data).

## Access Control & Validation

- Require tokens for any state-mutating command. Spectators get read-only channel without tokens (or special spectator token).
- Validate correlation of token to player side before accepting moves.
- Rate-limit commands per connection; drop connections on repeated invalid attempts.
- Use subprotocol versioning (e.g. `cbpg.v1`) to allow future upgrades.

## Error Handling & Retries

- Define typed errors (invalid token, invalid move, stale state) and communicate via `error` events with `retryable` flag.
- Implement reconnection flow: clients reconnect with token and last known revision number, server sends delta/full sync.

## Observability

- Log connection lifecycle, command handling duration, and dropped events for debugging.
- Surface metrics (if possible) for number of concurrent games, spectators, average move latency.

## TODO

- [ ] Specify HTTP routes + Router configuration in Worker for create/join/ws.
- [ ] Finalize WebSocket handshake query params and headers (tokens, role, revision).
- [ ] Define JSON schemas (TypeScript + Rust structs) for commands and events, ensuring parity via shared types.
- [ ] Outline error codes and retry strategy for clients.
- [ ] Plan reconnection/resume protocol with revision numbers or event sequence IDs.
- [ ] Document logging/metrics hooks to add during implementation.
