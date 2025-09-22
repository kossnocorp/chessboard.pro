# Game Mode Prototype

## Brief

Define the architecture, implementation approach, and integration tasks for prototyping a Cloudflare workers-based chess game mode that persists game state in a Durable Object, uses the `chess` crate for move validation, and exposes responsive web experiences for creation, play, and spectating.

## Plan

- [ ] [Bootstrap Worker Crate](agents/plans/001-game-mode-prototype/001-bootstrap-worker-crate.md): Scaffold the `chessboard_pro_game` workers-rs crate with Durable Object bindings, build tooling, and deployment configuration.
- [ ] [Design Durable Object Game Core](agents/plans/001-game-mode-prototype/002-design-durable-object-game-core.md): Model game state persistence, token flows, and chess logic inside a SQLite-backed Durable Object.
- [ ] [Implement Session and Realtime APIs](agents/plans/001-game-mode-prototype/003-implement-session-and-realtime-apis.md): Provide HTTP and WebSocket endpoints to create games, manage invitations, and broadcast authoritative updates.
- [ ] [Integrate Web App Experiences](agents/plans/001-game-mode-prototype/004-integrate-web-app-experiences.md): Build game creation and play pages in `pkgs/web`, wiring server components, tokens, board UI, and clocks to the Durable Object backend.
- [ ] [Enhance Gameplay UX](agents/plans/001-game-mode-prototype/005-enhance-gameplay-ux.md): Add draw/resign/timeouts, voice announcements, move history navigation, and spectator presentation.
- [ ] [Validation and Ops Readiness](agents/plans/001-game-mode-prototype/006-validation-and-ops-readiness.md): Establish testing, observability, and deployment procedures for the prototype.

## Steps

### [Bootstrap Worker Crate](agents/plans/001-game-mode-prototype/001-bootstrap-worker-crate.md)

Create the `pkgs/game` workspace member using workers-rs and configure tooling (Rust toolchain, `wrangler.toml`, type generation) to target Cloudflare Workers with Durable Objects. Define environment variables, secrets management expectations, and local development workflow (Wrangler dev, Durable Object migrations, SQLite persistence). Document how the crate integrates with the existing pnpm workspace and automated builds.

### [Design Durable Object Game Core](agents/plans/001-game-mode-prototype/002-design-durable-object-game-core.md)

Model the Durable Object schema and lifecycle for chess games using Cloudflare's SQLite storage best practices. Specify tables for metadata, move history, clocks, draw offers, and connection state. Detail how to integrate the `chess` crate for move validation, random side assignment, and state transitions (Initiated → Lobby → Active → Complete/Abandoned). Define token generation, storage, and validation rules, including initiator/invitation/player tokens and durable object IDs.

### [Implement Session and Realtime APIs](agents/plans/001-game-mode-prototype/003-implement-session-and-realtime-apis.md)

Describe HTTP endpoints (e.g., game creation) and WebSocket coordination flows handled by the Durable Object. Outline handshake protocols for initiators and invitees, lobby updates, move submissions, clock ticking, abandonment detection, and broadcast messages. Ensure acceptance payloads pass explicit time-control fields (base minutes, increment seconds) rather than an opaque preset label so the Durable Object stores canonical settings. Include error handling, reconnection strategy, and safeguards for token misuse or duplicate connections.

### [Integrate Web App Experiences](agents/plans/001-game-mode-prototype/004-integrate-web-app-experiences.md)

Plan the Next.js server components for `game/new` and `game/[id]`, including form handling, Durable Object creation, redirect logic, and token propagation. Surface Chess.com-style presets (e.g., 1+0, 3+2, 5+0, 10+0, 15+10) on the creation form while posting underlying base minutes and increment seconds to the backend. Detail client components for board rendering, clock display, invitation sharing, and WebSocket subscriptions. Identify areas to refactor existing board callbacks for reuse, and specify state management for spectators versus authenticated players.

### [Enhance Gameplay UX](agents/plans/001-game-mode-prototype/005-enhance-gameplay-ux.md)

Outline features covering move input (click or drag), Unicode piece rendering, Web Speech API announcements for moves/results, draw offer UX, resignation, timeout handling, and clock synchronization. Define move history presentation with clickable list, keyboard shortcuts (← →, space), and spectator-friendly layout. Address accessibility and mobile considerations for the board and controls.

### [Validation and Ops Readiness](agents/plans/001-game-mode-prototype/006-validation-and-ops-readiness.md)

Detail test strategy (unit tests for chess logic, integration tests for Durable Object flows, end-to-end smoke tests for pages), observability (logging, metrics, error tracking), and deployment pipeline steps. Include plans for local dev simulation (Durable Object stubs/mocks), edge-case validation (simulated disconnects, timeouts), and documentation handoff.

## Questions

### Time Control Presets

Which time control options (e.g., 3+2, 5+0, custom minutes/increment ranges) should the prototype offer on the creation form?

#### Answer

Offer the same presets Chess.com exposes for quick pairing (e.g., Bullet 1+0 and 2+1, Blitz 3+2 and 5+0, Rapid 10+0 and 15+10). When a game is accepted, submit the selected base minutes and increment seconds independently rather than passing the preset identifier so the Durable Object stores normalized settings.

### Authentication and Token Scope

Should tokens be tied to authenticated user identities, or remain bearer-only secrets for the prototype? Clarify expiry expectations and storage requirements for tokens on the client.

#### Answer

Treat initiator, invitation, and opponent tokens as bearer-only secrets without binding to account identity. Generate cryptographically strong values, persist them server-side, and require clients to store them locally (e.g., in memory or secure storage) for subsequent move/auth requests; no additional expiry beyond game lifecycle is needed for the prototype.

### Voice Announcement Requirements

Are there preferred languages or voices for the speech synthesis, and should announcements be optional/configurable per player?

#### Answer

Keep browser speech synthesis enabled by default using the user agent’s locale/voice selection; no alternate languages or player-specific opt-outs are required for the prototype.

## Notes

Assume use of Cloudflare Workers for deployment with Durable Objects backed by SQLite storage as recommended. Expect to leverage the Web Speech API for in-browser announcements and reuse existing board components in `pkgs/web`. Tokens operate as bearer-only secrets, so secure storage on the client is essential. Plan anticipates random side assignment via secure RNG (e.g., `rand` crate) and cryptographically strong invitation tokens (UUIDv4 or equivalent).

## Prompt

Generate a game mode prototype plan.

Don't treat my list as distinct steps, but rather organize it yourself using more appropriate organization as I will not try to organize them in order.

- I want you to create a crate chessboard_pro_game (pkgs/game) using Cloudflare workers: https://github.com/cloudflare/workers-rs. I want you to use Durable Objects.
- Use chess crate https://crates.io/crates/chess to implement a game. Store the game state in SQL-baked Durable Object class: https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/#create-sqlite-backed-durable-object-class
- A new game should pick a random side for the initiator. It should accept game settings (time control for now). It should generate three tokens, one for the initiator, another as an invitation that can be send to anyone else. When the object receives the invitation token it should assign the last token for the player that accepts the game. These two game tokens then will be used to make the moves. The initiator will only know its game token and the invitation token, as well as the durable object id. Durable object id will be the game id.
- Add game/new page to pkgs/web that shows a form where the initiator can pick the time control. The form action then creates a durable object. And redirects to game/[id]. Use server components to render the page and pass the game initiator token. Then it connect via ws to the durable object and once the initiator connects, the game should update the state from GameState::Initiated to GameState::Lobby. Until the game is accepted, the page should display the board with the right initiator side and the invitation link and button to copy it. The invitation should game/[id]?invitation=[token]
- Once the opponents opens the page, they should see the option to accept the game as long as there's a token.
- Page should also display the active clock.
- When the opponent accepts the game, the clock starts and the white side should make the move.
- For pieces, use the unicode symbols. Allow click-click or drag pieces. The durable object should use chess crate to validate the move and accept it, allowing another side to move. Use browser voice to announce the move, like in the vision.
- Game should play until one of the players resign, there's a checkmate or it runs of time. Then use voice to announce the result. Players should be able to offer draw that can be accepted or declined.
- If one of the players disconnect for an appropriate to the time control timeout, the game should be considered abandoned and the staying player wins. If both abandon, the loser is the one that supposed to make the move.
- Store the state of the game and allow anyone visiting the link to see it.
- Add buttons and keyboard shortcuts (left-right) to navigate the game history. Space should jump to the latest position.
- Display clickable history of moves on the side.
- Use existing board component to work with the game. Reuse/refactor the click callbacks.
