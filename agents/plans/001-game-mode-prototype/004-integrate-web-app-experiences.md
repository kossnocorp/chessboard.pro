# Integrate Web App Experiences

## Spec

Implement Next.js pages and client components that create games, connect players to the Durable Object, and present the board, clocks, and invitation flows across initiator, opponent, and spectator views.

## Tasks

- [ ] **Build `game/new` server route** — render the creation form with Chess.com presets.
      Create a server component that fetches preset options (1+0, 2+1, 3+2, 5+0, 10+0, 15+10), posts base minutes/increment to the creation API, handles errors, and redirects to `game/[id]` with initiator token embedded in server-provided props.
- [ ] **Implement `game/[id]` layout** — structure the page for players and spectators.
      Fetch initial game snapshot via server action, derive viewer role (initiator/opponent/spectator) from tokens or invitation query, and render the board, clocks, and invitation UI accordingly.
- [ ] **Connect WebSocket client hook** — encapsulate realtime communication.
      Create a React hook/util that opens the DO WebSocket with appropriate headers/query, handles reconnect and message parsing, and updates shared state stores for board position, clocks, and game status.
- [ ] **Reuse board component interactions** — adapt existing board logic for tokenized play.
      Refactor `pkgs/web/src/aspects/board` callbacks to trigger move submissions via the WebSocket, support click-click and drag-drop, and render Unicode pieces consistent with the design.
- [ ] **Surface invitation sharing UI** — display lobby state and copy action.
      Add initiator-only panel showing invitation link (`game/[id]?invitation=token`), include copy button with fallback instructions, and update state to hide once opponent joins.
- [ ] **Render active clocks and status banners** — show countdowns, turn indicator, and result messages.
      Synchronize timers with server-provided remaining durations, tick client-side with drift correction, and switch to final result state when game ends.

## Questions

None.

## Notes

- Ensure tokens remain client-side secrets; avoid storing them in cookies or server sessions beyond the initial handoff.
- Prefer React Server Components for initial data fetch while keeping realtime updates in client components.
