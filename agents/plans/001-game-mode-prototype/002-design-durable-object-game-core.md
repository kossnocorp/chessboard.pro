# Design Durable Object Game Core

## Spec

Define the Durable Object architecture for chess games, covering state schema, lifecycle transitions, and token flows backed by Cloudflare's SQLite storage best practices.

## Tasks

- [ ] **Outline Durable Object structure** — describe the Rust classes/modules backing the DO.
      Draft a doc (e.g., `pkgs/game/docs/durable-object.md`) explaining constructor dependencies, `fetch` handler responsibilities, WebSocket upgrade logic, and how the DO interacts with storage helpers.
- [ ] **Design SQLite schema** — specify tables and indices for game metadata, moves, clocks, and connections.
      Produce `pkgs/game/schema.sql` (or Rust migrations) with definitions for game state, tokens, move list, clock snapshots, draw offers, and disconnection timers; annotate access patterns and retention.
- [ ] **Map state machine transitions** — formalize game phases and events.
      Enumerate transitions (Initiated → Lobby → Active → Complete/Abandoned) in the design doc, including triggers (initiator joins, invitee accepts, resignation, timeout) and persisted side effects.
- [ ] **Define token and identity handling** — capture how bearer tokens are generated, stored, and validated.
      Document token structure (length/encoding), association with players, storage columns, and checks for invitation usage, reuse prevention, and spectator access.
- [ ] **Plan concurrency and durability safeguards** — specify locking, debouncing, and recovery strategies.
      Detail how the DO serializes state changes, queues updates for WebSocket clients, and ensures consistency after restarts (e.g., rehydrating clocks, replaying moves from storage).

## Questions

None.

## Notes

- Reuse the `chess` crate types in the design to ensure compatibility with the eventual implementation.
- Consider storing denormalized summaries (e.g., PGN string, clock remaining) to speed spectator reads while keeping authoritative records normalized.
