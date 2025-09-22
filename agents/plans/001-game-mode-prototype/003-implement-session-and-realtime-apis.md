# Implement Session and Realtime APIs

## Spec

Build HTTP and WebSocket interfaces that allow clients to create games, join via invitation tokens, exchange moves, and receive authoritative state updates from the Durable Object.

## Tasks

- [ ] **Expose game creation endpoint** — add an HTTP handler that provisions a Durable Object instance.
      Implement `/api/game/new` (or similar) to parse time-control payloads (base minutes, increment seconds), call the DO namespace to allocate a stub, generate initiator/invitation/opponent tokens, persist initial state, and return the game ID plus initiator token.
- [ ] **Implement invitation acceptance handler** — support POSTs that redeem invitation tokens.
      Accept payloads with `gameId` and `invitationToken`, forward to the DO to claim the seat, emit the opponent token, and handle error cases (duplicate use, expired game, already full).
- [ ] **Wire WebSocket upgrade flow** — allow both players and spectators to establish realtime sessions.
      Extend the DO `fetch` to upgrade to WebSocket, authenticate using bearer token or invitation query, send initial snapshot, and register the connection for broadcast updates.
- [ ] **Process move submissions** — define message schema and DO-side handlers.
      Accept JSON messages carrying SAN/uci moves and token identity, validate via `chess` crate, update storage (moves, clocks), broadcast new board state, and return errors for illegal moves or wrong turn.
- [ ] **Manage lobby and timeout events** — propagate game state transitions and enforcement.
      Implement lobby notifications when initiator connects, start clock on opponent join, handle resign/draw/time forfeits, and emit final result announcements.
- [ ] **Harden error and reconnect handling** — ensure resilience for clients.
      Standardize error codes/messages, support reconnection with last-known state, debounce duplicate messages, and record audit logs for debugging.

## Questions

None.

## Notes

- Keep payloads explicit; avoid sending preset identifiers by themselves when accepting games.
- Reuse schema and token rules defined in the Durable Object core design to avoid duplication.
