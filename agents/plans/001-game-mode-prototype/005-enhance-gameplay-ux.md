# Enhance Gameplay UX

## Spec

Deliver polished gameplay interactions including move entry options, voice announcements, move history navigation, and draw/resign/time controls that respond to realtime game events.

## Tasks

- [ ] **Support dual input modalities** — enable click-click and drag-drop moves.
      Extend the board component to track selection state for clicks, integrate drag events, prevent illegal input when it is not the player’s turn, and produce standardized payloads for the WebSocket client hook.
- [ ] **Render Unicode pieces consistently** — ensure board and captured pieces use Unicode glyphs.
      Audit the board rendering pipeline to enforce glyph usage across themes, apply typography tweaks for readability, and validate mobile scaling.
- [ ] **Implement Web Speech announcements** — announce moves and results in browser voice.
      Use the SpeechSynthesis API to queue descriptive move strings (with check/checkmate indicators) and final results, include preferences toggles in UI state if needed later, and debounce announcements to avoid overlaps.
- [ ] **Manage draw offers and resignations** — add controls and message handling.
      Provide buttons for offering/accepting draws and resigning, hook them into WebSocket messages, update UI state to show pending offers, and display confirmations or declines.
- [ ] **Handle disconnections and timeouts** — reflect abandonment rules.
      Display warnings when a player disconnects, start timeout countdowns based on time control, auto-resolve to abandoned outcome per specification, and inform spectators of the result.
- [ ] **Build move history navigation** — add list, keyboard, and quick-jump controls.
      Render a scrollable move list with clickable entries, implement ←/→ keyboard listeners, map spacebar to jump to latest move, and sync board display with selected history index.

## Questions

None.

## Notes

- Consider accessibility cues (focus states, aria-live regions) when introducing keyboard navigation and voice output.
- Keep speech synthesis optional via future settings but default to enabled for the prototype.
