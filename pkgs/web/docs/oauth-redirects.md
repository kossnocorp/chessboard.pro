OAuth Redirect URIs

Production (NEXT_PUBLIC_SITE_URL=https://chessboard.pro)

- https://chessboard.pro/api/auth/callback/chesscom
- https://chessboard.pro/api/auth/callback/lichess

Local development

- http://localhost:3000/api/auth/callback/chesscom
- http://localhost:3000/api/auth/callback/lichess
- http://127.0.0.1:3000/api/auth/callback/chesscom
- http://127.0.0.1:3000/api/auth/callback/lichess

Notes

- The callback path follows Better Auth’s default: `/api/auth/callback/:providerId`.
- Provider ids assumed here: `chesscom` and `lichess`.
- Keep `NEXT_PUBLIC_SITE_URL` in sync between environments.

