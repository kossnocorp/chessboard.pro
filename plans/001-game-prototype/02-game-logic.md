# Game Logic & Storage

## Objectives

- Implement Durable Object state management for lifecycle phases: `Initiated`, `Lobby`, `InProgress`, `Completed`, and `Abandoned`.
- Integrate the `chess` crate to enforce legal moves, detect game termination (checkmate, stalemate, draw), and track move history/SAN strings.
- Persist all game data (players, tokens, clocks, moves, offers, voice announcements) in the SQL-backed Durable Object storage for durability and spectator reads.

## State & Data Model

- **Identifiers & Tokens**: Generate Durable Object IDs as game IDs. Produce three cryptographically secure tokens: `initiator_token`, `invitation_token`, `opponent_token` (assigned on accept). Store hashed tokens for verification, return plaintext only when issuing.
- **Players**: Track side assignment (`White`/`Black`), display names (optional), connection status, last-seen timestamp, and draw/resign flags.
- **Game Settings**: Persist time control (initial clock + increment/delay if needed). Include allowance for future settings (e.g. rated flag) via JSON column.
- **Clocks**: Store remaining time per side, last move timestamp, and active side. Expose logic to pause/resume when players disconnect or game waits to start.
- **Moves & History**: Append move records with full metadata (move number, SAN, UCI, captured piece, resulting FEN, clock snapshots). Support annotations for voice or user events.
- **Offers & Events**: Record draw offers, resignations, abandon events, chat/voice cues, and acceptance/decline outcomes.

## Lifecycle Rules

- **Initiation**: On creation, randomly assign initiator side, default game state to `Initiated`, store tokens, persist settings.
- **Lobby**: Transition to `Lobby` once initiator connects via WebSocket; broadcast invitation link payload.
- **Acceptance**: Validate invitation token, issue opponent token, set opponent side, change state to `InProgress`, initialize clocks, and set active side (white).
- **Gameplay**: For each move, validate token, ensure correct turn, check legality via `chess` board, update board state + clocks, broadcast events, persist snapshot.
- **Time Control**: On move submission, decrement active player's clock based on elapsed real-time; on clock reaching zero, mark timeout win.
- **Voice Events**: Determine messages for move announcements, draw offers, resignations, timeouts, and results; persist to event log for clients.
- **Draw/Resign**: Accept draw when both sides consent; resign immediately ends game with winner = other side.
- **Abandonment**: Track disconnection windows. If only one player disconnects beyond threshold (config from time control), declare win for present player; if both disconnect, side to move loses after timeout.
- **Spectator Access**: Provide read-only view of state history without exposing private tokens; allow watchers to replay moves.

## Persistence Strategy

- Use SQL tables within Durable Object storage (per Cloudflare guidance) for `players`, `moves`, `events`, `metadata`.
- Maintain derived JSON blob for quick state reads (current board/clocks), updating atomically with transactions.
- Consider TTL or archival strategy for completed games (potential export later).

## Validation & Testing

- Unit tests for state transitions, move validation, token verification, and time calculations (with deterministic clocks).
- Property-based or fuzz tests around move legality and draw/abandon scenarios.
- Integration tests (wrangler preview) ensuring storage reads/writes behave as expected.

## TODO

- [ ] Design SQL schema + migrator for Durable Object tables and ensure atomic updates.
- [ ] Implement state machine enums/structs with serde serialization for storage and WebSocket payloads.
- [ ] Wire token generation/verification with secure random + hashing.
- [ ] Integrate `chess` crate board updates, move validation, and termination detection.
- [ ] Implement clock accounting + abandonment timers tied to connection state.
- [ ] Add draw/resign/abandon outcome handlers and event logging for voice announcements.
- [ ] Write unit/integration tests covering state transitions and persistence guarantees.
