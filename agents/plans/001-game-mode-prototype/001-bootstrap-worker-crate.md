# Bootstrap Worker Crate

## Spec

Set up the `pkgs/game` Cloudflare Workers crate with Durable Object support, align it with the existing workspace tooling, and document how to build and run it locally.

## Tasks

- [ ] **Scaffold `chessboard_pro_game` crate** — create a new workers-rs project in `pkgs/game` configured for Durable Objects.
      Use `cargo generate cloudflare/workers-rs` or manual `cargo init --lib` to scaffold, ensure `Cargo.toml` sets `crate-type = ["cdylib"]`, add `workers = "*"`, and wire `wasm-bindgen`. Add initial source files (`lib.rs`, `durable.rs`, etc.) alongside a README stub describing the crate.
- [ ] **Register crate in workspace tooling** — expose the new crate to cargo, pnpm, and mise workflows.
      Update root `Cargo.toml` `[workspace]` members, add any necessary `pnpm` scripts (e.g., `pnpm --filter @chessboard.pro/game ...`), and ensure `mise.toml` tasks (if any) cover building/testing the worker.
- [ ] **Create Wrangler configuration** — define deployment config with Durable Object binding metadata.
      Add `pkgs/game/wrangler.toml` specifying name, `main` build path, compatibility date/flags, Durable Object class binding (e.g., `GameObject`), migrations stub, and environment overrides for dev/prod.
- [ ] **Integrate Durable Object SQLite storage** — configure local durable-object storage and migrations.
      Add migration entries via `wrangler.toml`, set up `bindings` for DO storage, ensure dev instructions outline `wrangler dev --local` usage, and include `durable_objects` binding referencing the DO class.
- [ ] **Document development workflow** — capture commands for local dev, testing, and deployments.
      Author `pkgs/game/README.md` (or section in project docs) describing how to run `wrangler dev`, generate types, and build release artifacts; note expectations for environment variables and secrets.

## Questions

None.

## Notes

- Align toolchain versions with existing `rust-toolchain.toml` and leverage `pnpm exec wrangler` where possible.
- Prefer `wrangler deploy --dry-run` during bootstrap to validate configuration without pushing to production.
