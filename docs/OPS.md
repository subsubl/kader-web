# Kader — Server Ops & Services runbook

Operational documentation for the Promethean Creation Station v2 delivery pipeline
and the self-hosted Kader servers.

## Architecture (memory focus)

```
n8n (Promethean Creation Station v2)  --workflow `kr90B0XZ8Q8PuM5t`-->
  [6 agent chain: Athena → Metis → Perdix → Daedalus → Cassandra → Talos] -->
  POST build artifact  -->
  http://192.168.64.139:9091  (ship-receiver)  -->  /var/www/kader/_incoming/*.json
```

- **Producer:** n8n workflow **`⚡ Promethean Creation Station v2 (kr90B0XZ8Q8PuM5t)`**, webhook path
  `promethean-creation-station-v2` on `http://192.168.64.137:5678`. Final node ("Ship to Hermes")
  POSTs the bundled JSON to `http://192.168.64.139:9091`.
- **Receiver:** `node /var/www/kader/ship-receiver.js` — pure-Node HTTP server on **port 9091**.
  Saves each valid payload as `/var/www/kader/_incoming/ship-<ISO>.json` (pretty-printed); invalid
  JSON is saved as `*.json.raw`. Returns `{status: received}`.
- **Consumers:** the standard flow is to read the newest file in `_incoming/`, extract each agent's
  `output` (JSON), and publish to GitHub (new repo/draft PR per build).

## Service management (systemd — USER unit)

Running as a **user** service for the `hermes` account (no root; `Linger=yes` keeps it alive
without a login session).

```bash
export XDG_RUNTIME_DIR=/run/user/1000

# manage
systemctl --user status  kader-ship-receiver.service
systemctl --user restart kader-ship-receiver.service
systemctl --user stop    kader-ship-receiver.service

# logs
journalctl --user -u kader-ship-receiver -f
journalctl --user -u kader-ship-receiver --since "10 minutes ago"
```

- **Unit file:** `~/.config/systemd/user/kader-ship-receiver.service`
- **Enabled + started at boot** (persistent via linger).
- **Auto-restart:** `Restart=on-failure`, `RestartSec=5`. Verified: `kill -9` → new PID rebinds port 9091.

### Key facts
| Item | Value |
|---|---|
| Port | 9091 |
| Node | `/usr/bin/node` (v22.23.2) |
| Output dir | `/var/www/kader/_incoming` |
| Runs as | `hermes` (uid 1000) |
| Restart | on-failure / 5s |

## Related system services (run as root via sudo)
- `kader-deploy-api.service` — `/var/www/kader/deploy-api.js` on **port 9090** (deploy API for web builds).
- `n8n-tunnel.service`, `adminer-tunnel.service`, `supabase-tunnel.service`, `supabase-studio-tunnel.service` — Cloudflare tunnels.

## Gotchas
- **Port 9091 is NOT TLS** — internal network only; it receives from n8n on the LAN. Do not expose publicly.
- To bind a low, unprivileged-alias port or run as root (to match deploy-api), use a **system** unit in
  `/etc/systemd/system/` instead (needs sudo) — mirror `kader-deploy-api.service`.
- The receiver holds the process as a long-lived daemon; do NOT run it with `nohup`/`disown` anymore.