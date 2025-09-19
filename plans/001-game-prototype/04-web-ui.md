# Web UI Integration

## Objectives

- Implement `/game/new` and `/game/[id]` server components that coordinate with the Worker to create games, distribute tokens, and render lobby/gameplay UI.
- Reuse/refactor the existing board component (`pkgs/web/src/aspects/board`) for interactive play, supporting click-click and drag interactions with Unicode pieces.
- Provide UX for invitation sharing, clock display, move history navigation, voice announcements, and draw/resign/abandon interactions.

## Page Flows

- **`/game/new` (Server Component)**
  - Render time-control form (initial minutes, increment) with validation.
  - On submit, call server action that POSTs to Worker, receives `{ gameId, initiatorToken, invitationToken, side }`.
  - Redirect to `/game/[id]` with tokens stored in HTTP-only cookie or encrypted session for initiator; pass initial props via server component.
- \*\*`/game/[id]` (Server Component + Client Bridges)
  - Load initial state by calling Worker (GET) to allow spectators to view board without tokens.
  - If request contains invitation token query param, render accept UI that triggers invocation to Worker to mint opponent token, then store token (cookie/session) and upgrade to player view.
  - Hydrate client component that establishes WebSocket using stored player token and subscribes to state/clock events.
  - Display board oriented to assigned side; show invitation link + copy button until opponent joins.
  - Show clocks counting down with active player highlight; start when opponent joins.
  - Provide draw/resign buttons, offer/response dialogs, and abandonment notifications.
  - Render move history list with clickable entries; integrate keyboard shortcuts (← →, space) to navigate history and jump to latest.
  - Trigger Web Speech API (or similar) for voice announcements on events; allow mute toggle.
  - Handle disconnection states with reconnection instructions.
  - Offer spectator-only layout (no move controls) when no valid player token present.

## Component & State Structure

- **Board Component Integration**: adapt existing board component APIs to receive move events from WebSocket, emit move intents, and support drag/click.
- **State Management**: use React context/store (e.g. Zustand) to unify board state, history cursor, clocks, and voice queue.
- **Token Handling**: store player tokens securely (cookies with HttpOnly + SameSite) and expose to client via one-time hydration token endpoint.
- **Voice**: utilize browser speech synthesis; queue announcements based on `voice.queue` events.
- **Accessibility**: ensure keyboard controls, screen-reader-friendly move announcements, and focus management for modals.

## Styling & UX Guidelines

- Board + sidebar layout with responsive design (mobile vertical stacking).
- Emphasize invitation banner in lobby state with copy-to-clipboard button.
- Visually differentiate completed games (result banner, disabled inputs).
- Provide clock color changes as time runs low (<30s) and audio cue (optional).

## Integration Considerations

- Use Suspense for server components waiting on initial Worker fetch.
- Implement SWR or streaming updates for spectators without tokens.
- Consider service worker or caching strategy for offline/resume.
- Ensure environment variables (Worker base URL) are available in Next.js runtime.

## TODO

- [ ] Design form + server action for `/game/new` time-control creation flow.
- [ ] Implement token storage/serialization strategy between server/client.
- [ ] Build `/game/[id]` server component loader fetching public game snapshot.
- [ ] Wire client-side WebSocket hooks and state store to board/clock UI.
- [ ] Enhance board component for click + drag + history cursor integration.
- [ ] Implement invitation banner, copy link, and acceptance UI tied to tokens.
- [ ] Add draw/resign/voice UI, move history navigation, and keyboard shortcuts.
- [ ] Ensure spectator view, result display, and disconnection handling are polished.
