# Worker Scaffold & Architecture

## Objectives

- Create a `pkgs/game/chessboard_pro_game` Worker crate using `workers-rs` with Durable Object support enabled.
- Configure the workspace (Cargo + repo tooling) so the crate builds, tests, and deploys via Wrangler with Cloudflare type generation wired into the monorepo (`pnpm --filter @chessboard.pro/web run cf-typegen`).
- Establish shared type contracts between the Worker and web app (Game IDs, tokens, payload envelopes) using `wrangler types` output and/or generated bindings.

## Scope Notes

- Crate must target `wasm32-unknown-unknown` and compile with the latest `workers-rs` release supporting Durable Objects + WebSockets.
- Define a single Durable Object class (e.g. `GameRoom`) bound in `wrangler.toml`, with environment bindings for KV/DO namespaces as needed.
- Ensure SQL-backed Durable Object storage is enabled via the Cloudflare preview feature flag, and document required compatibility date + experimental flags.
- Provide scripts (pnpm/cargo) for local dev: `wrangler dev`, `wrangler deploy`, `cargo fmt`, `cargo test`, plus lint/format hooks consistent with repo standards.
- Set up error logging and tracing (e.g. `console_error_panic_hook`, structured logs) for observability.

## Deliverables

- `pkgs/game/Cargo.toml`, `src/lib.rs`, and module layout for Worker entrypoint, Durable Object implementation scaffold, and shared models.
- Updated top-level workspace manifests (`Cargo.toml`, `Cargo.lock` if checked in) and any necessary `pnpm` scripts.
- `wrangler.toml` (or environment-specific variants) referencing the new Durable Object, compatibility date, and migrations for the SQL storage.
- Type generation pipeline documentation/README snippet capturing how to sync Worker types to the web package.

## Risks / Questions

- Confirm SQLite-backed Durable Objects are GA for our compatibility date; otherwise note required beta opt-in.
- Clarify deployment environments (staging/prod) and naming conventions for Durable Object namespaces.
- Decide how secrets/config (e.g. voice API keys, if any) are injected (Wrangler vars vs. D1).

## TODO

- [ ] Scaffold `pkgs/game/chessboard_pro_game` crate with workers-rs entrypoint and Durable Object registration.
- [ ] Update Cargo workspace + tooling configs to include the new crate and ensure `cargo fmt/test` succeed for wasm target.
- [ ] Author/adjust `wrangler.toml` with DO binding, compatibility date, and SQL-backed storage flags.
- [ ] Document type generation workflow and ensure pnpm scripts hook into `wrangler types` for this Worker.
- [ ] Add developer notes for building, running `wrangler dev`, and observing logs locally.
