# Dokploy MCP Server

[![npm version](https://img.shields.io/npm/v/@dokploy/mcp.svg)](https://www.npmjs.com/package/@dokploy/mcp) [<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Dokploy%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40dokploy%2Fmcp%40latest%22%5D%7D)

Dokploy MCP Server exposes **all Dokploy API endpoints** as tools consumable via the Model Context Protocol (MCP). It allows MCP-compatible clients (e.g., AI models, other applications) to interact with your Dokploy server programmatically.

With **508 tools** across **49 categories**, this server provides complete coverage of the Dokploy API — from project and application management to databases, notifications, SSO, Docker, backups, and more.

## Getting Started

### Requirements

- Node.js >= v18.0.0 (or Docker)
- Cursor, VS Code, Claude Desktop, or another MCP Client
- A running Dokploy server instance

### Install in Cursor

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Add this to your Cursor `~/.cursor/mcp.json` file. You may also install in a specific project by creating `.cursor/mcp.json` in your project folder. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

<details>
<summary>Alternative: Use Bun</summary>

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "bunx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

</details>

<details>
<summary>Alternative: Use Deno</summary>

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "deno",
      "args": ["run", "--allow-env", "--allow-net", "npm:@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

</details>

### Install in Windsurf

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more info.

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in VS Code

[<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Dokploy%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40dokploy%2Fmcp%40latest%22%5D%7D)
[<img alt="Install in VS Code Insiders (npx)" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Dokploy%20MCP&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40dokploy%2Fmcp%40latest%22%5D%7D)

Add this to your VS Code MCP config file. See [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

```json
{
  "servers": {
    "dokploy-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in Claude Code

Add the MCP server to Claude Code using the CLI:

```bash
claude mcp add dokploy-mcp -- npx -y @dokploy/mcp
```

Then set the environment variables in your `.claude/settings.json` or pass them inline:

```bash
DOKPLOY_URL=https://your-dokploy-server.com DOKPLOY_API_KEY=your-token claude
```

### Install in Zed

Add this to your Zed `settings.json`. See [Zed Context Server docs](https://zed.dev/docs/assistant/context-servers) for more info.

```json
{
  "context_servers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in Claude Desktop

Add this to your Claude Desktop `claude_desktop_config.json` file. See [Claude Desktop MCP docs](https://modelcontextprotocol.io/quickstart/user) for more info.

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in BoltAI

Open the "Settings" page of the app, navigate to "Plugins," and enter the following JSON:

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in Opencode

Add this to your OpenCode configuration (located by default in ~/.config/opencode/opencode.json or opencode.json for local/project config). See [Opencode MCP config](https://opencode.ai/docs/mcp-servers/) for more info.

```json
{
  "mcp": {
    "dokploy": {
      "type": "local",
      "command": ["npx", "-y", "@dokploy/mcp"],
      "environment": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      },
      "enabled": true
    }
  }
}
```

### Using Docker

The Docker container supports both **stdio** and **HTTP** transport modes, making it flexible for different deployment scenarios.

1.  **Build the Docker Image:**

    ```bash
    git clone https://github.com/Dokploy/mcp.git
    cd mcp
    docker build -t dokploy-mcp .
    ```

2.  **Manual Docker Commands:**

    **Stdio Mode (for MCP clients):**

    ```bash
    docker run -it --rm \
      -e DOKPLOY_URL=https://your-dokploy-server.com \
      -e DOKPLOY_API_KEY=your_token_here \
      dokploy-mcp
    ```

    **HTTP Mode (for web applications):**

    ```bash
    docker run -it --rm \
      -p 8080:3000 \
      -e MCP_TRANSPORT=http \
      -e DOKPLOY_URL=https://your-dokploy-server.com \
      -e DOKPLOY_API_KEY=your_token_here \
      dokploy-mcp
    ```

3.  **Docker Compose:**

    Use the provided `docker-compose.yml` for production deployments:

    ```bash
    # Start HTTP service
    docker-compose up -d dokploy-mcp-http

    # View logs
    docker-compose logs -f dokploy-mcp-http
    ```

4.  **MCP Client Configuration:**

    **For stdio mode (Claude Desktop, VS Code, etc.):**

    ```json
    {
      "mcpServers": {
        "dokploy-mcp": {
          "command": "docker",
          "args": [
            "run",
            "-i",
            "--rm",
            "-e",
            "DOKPLOY_URL=https://your-dokploy-server.com",
            "-e",
            "DOKPLOY_API_KEY=your_token_here",
            "dokploy-mcp"
          ]
        }
      }
    }
    ```

    **For HTTP mode (web applications):**

    Start the HTTP server first, then configure your client to connect to `http://localhost:3000/mcp`.

### Install in Windows

The configuration on Windows is slightly different compared to Linux or macOS. Use `cmd` as the command wrapper:

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@dokploy/mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DOKPLOY_URL` | Yes | Your Dokploy server URL (e.g., `https://your-dokploy-server.com`) |
| `DOKPLOY_API_KEY` | Yes | Your Dokploy API authentication token |
| `DOKPLOY_CUSTOM_HEADERS` | No | JSON object of additional upstream request headers. Header names and values must be strings. Reserved headers cannot be set here: `x-api-key`, `content-type`, `accept`. |
| `DOKPLOY_TOOL_PRESET` | No | Predefined toolset to load: `all` (default), `minimal`, `core`, `deploy`, `databases`, or `git`. Useful for clients/providers that struggle with very large tool lists. |
| `DOKPLOY_ENABLED_TAGS` | No | Comma-separated list of tags to filter which tools are loaded (e.g., `project,application,postgres`) |
| `DOKPLOY_DISABLED_TAGS` | No | Comma-separated list of tags to exclude from the selected toolset. Applied after `DOKPLOY_TOOL_PRESET` or `DOKPLOY_ENABLED_TAGS`. |
| `DOKPLOY_TIMEOUT` | No | Request timeout in milliseconds (default: `30000`) |
| `DOKPLOY_RETRY_ATTEMPTS` | No | Number of retry attempts (default: `3`) |
| `DOKPLOY_RETRY_DELAY` | No | Delay between retries in milliseconds (default: `1000`) |
| `DOKPLOY_REDACT_ENV` | No | Redacts secret-bearing fields (env vars, compose files, passwords, tokens, keys) from API responses before they reach the MCP client (default: `true`). Set to `false` only if you explicitly need raw secret values in LLM context. |
| `DOKPLOY_REDACT_FIELDS` | No | Comma-separated list of response field names to redact when `DOKPLOY_REDACT_ENV=true`. Matched case-insensitively at any nesting depth. Defaults to: `env`, `buildArgs`, `composeFile`, `dockerCompose`, `environment`, `buildSecrets`, `previewBuildSecrets`, `password`, `currentPassword`, `appPassword`, `databasePassword`, `databaseRootPassword`, `redisPassword`, `mariadbPassword`, `mongoPassword`, `mysqlPassword`, `postgresPassword`, `registryPassword`, `token`, `accessToken`, `appToken`, `apiToken`, `botToken`, `refreshToken`, `secret`, `clientSecret`, `apiKey`, `secretAccessKey`, `accessKey`, `licenseKey`, `userKey`, `privateKey`, `privateKeyPass`, `encPrivateKey`, `encPrivateKeyPass`, `sshKey`, `sshPrivateKey`, `customGitSSHKey`, `dockerAuth`. |
| `DOKPLOY_EXTRA_REDACT_FIELDS` | No | Comma-separated field names to redact **in addition to** the defaults. Prefer this over `DOKPLOY_REDACT_FIELDS` when you only want to add entries. |
| `DOKPLOY_BLOCK_SECRET_PATHS` | No | Refuses file-access tools when the requested `path` looks secret-bearing (default: `true`). See [Secret path guard](#secret-path-guard). Set to `false` to disable. |
| `DOKPLOY_EXTRA_SECRET_PATHS` | No | Comma-separated glob patterns to block **in addition to** the defaults. Prefer this over `DOKPLOY_SECRET_PATH_PATTERNS` when you only want to add entries. |
| `DOKPLOY_SECRET_PATH_PATTERNS` | No | Comma-separated glob patterns overriding the blocked paths. A pattern containing `/` is matched against the whole normalized path, any other pattern against the file name only. Defaults to: `.env`, `.env.*`, `*.env`, `/run/secrets/**`, `**/secrets/**`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa*`, `id_dsa*`, `id_ecdsa*`, `id_ed25519*`, `.npmrc`, `.netrc`, `.pgpass`, `.git-credentials`, `.htpasswd`, `credentials`, `credentials.*`, `**/.ssh/**`, `**/.aws/**`, `**/.gnupg/**`, `**/.docker/config.json`, `**/.kube/config`, `/var/lib/postgresql/**`, `/var/lib/mysql/**`, `/var/lib/mongodb/**`, `/var/lib/redis/**`, `/data/db/**`, `**/postgresql/data/**`, `**/pgdata/**`, `*.rdb`, `*.aof`, `*.sqlite`, `*.sqlite3`. |

### Secret path guard

`DOKPLOY_REDACT_ENV` masks secret-bearing fields by matching the *field name* of an API response. That works for structured responses such as application or compose configuration, but it cannot protect the tools that return raw file contents:

- `docker-readContainerFile`, `docker-listContainerFiles`, `docker-writeContainerFile`, `docker-deleteContainerFile`
- `dockerVolume-readVolumeFile`, `dockerVolume-listVolumeFiles`, `dockerVolume-writeVolumeFile`, `dockerVolume-deleteVolumeFile`
- `settings-readTraefikFile`, `settings-updateTraefikFile`

For these, the secret arrives as an opaque string whose field name reveals nothing, so name-based redaction never fires — reading `/app/.env` would hand every variable straight to the model.

`DOKPLOY_BLOCK_SECRET_PATHS` closes that gap on the request side. Before such a tool runs, its `path` argument is normalized (traversal segments and percent-encoding are resolved) and matched against `DOKPLOY_SECRET_PATH_PATTERNS`. On a match the call is refused; everything else about the tool stays available, so reading `/app/logs/error.log` continues to work while `/app/.env` does not.

The guard is derived from the presence of a `path` argument rather than from a hardcoded list of tool names, so newly added file-access tools are covered automatically.

**Second layer — assignments inside file contents.** A deny-list only covers the paths someone thought of. When a file-access tool does return contents, those contents are additionally scanned for `KEY=value` assignments, and the value is masked whenever the key names a secret according to the very same `DOKPLOY_REDACT_FIELDS` list. So a stray `DB_PASSWORD=hunter2` inside `/app/config/local.conf` is masked, while `PORT=3000` in the same file stays readable. This pass runs only on responses from tools that take a `path`, so ordinary API payloads are unaffected, and it is disabled together with `DOKPLOY_REDACT_ENV=false`.

**Add to the lists, don't replace them.** `DOKPLOY_REDACT_FIELDS` and `DOKPLOY_SECRET_PATH_PATTERNS` replace the built-in defaults wholesale. That is rarely what you want: to add a single entry you have to write out the whole list, and a list copied from an older README quietly drops protections you never intended to remove. Use `DOKPLOY_EXTRA_REDACT_FIELDS` and `DOKPLOY_EXTRA_SECRET_PATHS` instead — they keep the defaults and append to them:

```bash
DOKPLOY_EXTRA_SECRET_PATHS='/opt/myapp/secrets.conf,**/*.backup'
DOKPLOY_EXTRA_REDACT_FIELDS='internalSigningKey'
```

Setting a full override still works, but the server logs a warning at startup, because silently weakening a security default should be visible.

**Database storage counts as a secret.** The deny-list covers more than credential files: relational engines keep row data unencrypted on disk, so reading `/var/lib/postgresql/data/base/16384/2619` returns the contents of a table in the clear — without SQL, without a password, and without the server even running. Locations like `/var/lib/mysql/**`, `/data/db/**` and `*.sqlite3` are blocked for the same reason. These entries are anchored to absolute paths or to distinctive directory names so that an unrelated `node_modules/mysql` is not caught by accident.

> **Scope:** this is a guard on what reaches the MCP client, not a server-side permission boundary. Anyone holding the same `DOKPLOY_API_KEY` can still call the Dokploy API directly.

For Dokploy instances behind Cloudflare Access or a similar reverse proxy, pass service-token headers with placeholder values like this:

```bash
DOKPLOY_CUSTOM_HEADERS='{"CF-Access-Client-Id":"your-client-id.access","CF-Access-Client-Secret":"your-client-secret"}'
```

## Transport Modes

This MCP server supports multiple transport modes to suit different use cases:

### Stdio Mode (Default)

The default mode uses stdio for direct process communication, ideal for desktop applications and command-line usage.

```bash
# Run with stdio (default)
npx -y @dokploy/mcp
```

### HTTP Mode (Streamable HTTP + Legacy SSE)

Modern HTTP mode exposes the server via HTTP/HTTPS supporting **both modern and legacy protocols** for maximum compatibility:

- **Streamable HTTP (MCP 2025-03-26)** - Modern protocol with session management
- **Legacy SSE (MCP 2024-11-05)** - Backwards compatibility for older clients

```bash
# Run with HTTP mode
npx -y @dokploy/mcp --http
# or via environment variable
MCP_TRANSPORT=http npx -y @dokploy/mcp
```

**Modern Streamable HTTP Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | Client-to-server requests |
| `/mcp` | GET | Server-to-client notifications (SSE) |
| `/mcp` | DELETE | Session termination |
| `/health` | GET | Health check |

**Legacy SSE Endpoints (Backwards Compatibility):**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | SSE stream initialization |
| `/messages` | POST | Client message posting |

## Available Tools (508)

This MCP server provides **508 tools** covering the entire Dokploy API, organized into **49 categories**:

### Core Resources

| Category | Tools | Description |
|----------|-------|-------------|
| **Project** | 8 | Create, list, update, duplicate, search, and delete projects |
| **Application** | 30 | Full application lifecycle — create, deploy, redeploy, start, stop, build types, git providers (GitHub, GitLab, Bitbucket, Gitea), environment, Traefik config |
| **Compose** | 29 | Docker Compose management — create, deploy, templates, services, environment, isolated deployments |
| **Domain** | 9 | Domain CRUD, DNS validation, Traefik.me generation |
| **Environment** | 7 | Multi-environment support per project |
| **Deployment** | 8 | Deployment history, queue management, centralized view |

### Databases

| Category | Tools | Description |
|----------|-------|-------------|
| **PostgreSQL** | 15 | Full lifecycle — create, deploy, start, stop, rebuild, passwords, external ports, environment |
| **MySQL** | 15 | Full lifecycle — create, deploy, start, stop, rebuild, passwords, external ports, environment |
| **MariaDB** | 15 | Full lifecycle — create, deploy, start, stop, rebuild, passwords, external ports, environment |
| **MongoDB** | 15 | Full lifecycle — create, deploy, start, stop, rebuild, passwords, external ports, environment |
| **Redis** | 15 | Full lifecycle — create, deploy, start, stop, rebuild, passwords, external ports, environment |
| **LibSQL** | 13 | Full lifecycle — create, deploy, start, stop, rebuild, external ports, environment |

### Infrastructure

| Category | Tools | Description |
|----------|-------|-------------|
| **Server** | 17 | Multi-server management, metrics, security, monitoring setup |
| **Docker** | 9 | Container management — list, restart, remove, upload files, inspect config |
| **Cluster / Swarm** | 8 | Swarm node management, container stats, cluster operations |
| **Settings** | 51 | Server settings, Traefik config, Docker cleanup, GPU, monitoring, Redis, disk usage |
| **Registry** | 7 | Docker registry management and testing |

### Security & Auth

| Category | Tools | Description |
|----------|-------|-------------|
| **SSO** | 10 | Single sign-on providers, trusted origins |
| **SSH Keys** | 7 | SSH key management — create, generate, list, update, remove |
| **Certificates** | 5 | SSL/TLS certificate management |
| **Security** | 4 | Basic auth and security rules per application |
| **Custom Roles** | 6 | Role-based access control with custom permissions |
| **User** | 23 | User management, permissions, API keys, invitations, metrics |
| **Organization** | 11 | Multi-org support, invitations, member roles |

### Operations

| Category | Tools | Description |
|----------|-------|-------------|
| **Backup** | 12 | Database backups — Postgres, MySQL, MariaDB, MongoDB, LibSQL, Compose, WebServer |
| **Volume Backups** | 6 | Volume-level backup scheduling and management |
| **Destination** | 6 | S3-compatible backup destinations (AWS, Cloudflare R2, etc.) |
| **Schedule** | 6 | Scheduled tasks — cron-based automation |
| **Notification** | 41 | Multi-channel alerts — Slack, Discord, Telegram, Email, Teams, Gotify, Ntfy, Pushover, Lark, Mattermost, Resend, Custom webhooks |
| **Rollback** | 2 | Application rollback management |

### Other

| Category | Tools | Description |
|----------|-------|-------------|
| **AI** | 9 | AI-powered suggestions, model management |
| **Git Providers** | 27 | GitHub, GitLab, Gitea, Bitbucket — branches, repos, connection testing |
| **Tag** | 8 | Project tagging and bulk assignment |
| **Patch** | 12 | File patching system for applications |
| **Mounts** | 6 | Volume and bind mount management |
| **Port** | 4 | Port mapping configuration |
| **Redirects** | 4 | URL redirect rules |
| **Preview Deployments** | 4 | PR preview deployment management |
| **Stripe** | 7 | Billing and subscription management |
| **License Key** | 6 | Enterprise license management |
| **Whitelabeling** | 4 | Custom branding for enterprise |
| **Audit Log** | 1 | Activity audit trail |
| **Admin** | 1 | Admin-level monitoring setup |

### Tool Filtering

By default, the server exposes all Dokploy API tools. Some MCP clients and LLM providers can be slower or less reliable when very large tool lists are sent to the model. You can reduce the loaded tools with presets or tag filters.

Use `DOKPLOY_TOOL_PRESET` for common workflows:

| Preset | Included tags |
|--------|---------------|
| `all` | All tools (default) |
| `minimal` | `project`, `application` |
| `core` | `project`, `server`, `application` |
| `deploy` | `project`, `environment`, `server`, `application`, `compose`, `domain`, `deployment` |
| `databases` | `postgres`, `redis`, `mysql`, `mariadb`, `mongo`, `libsql` |
| `git` | `github`, `gitlab`, `bitbucket`, `gitea`, `gitProvider`, `registry`, `sshKey` |

```bash
# Recommended starting point for clients/providers sensitive to large toolsets
DOKPLOY_TOOL_PRESET=minimal
```

For exact control, set `DOKPLOY_ENABLED_TAGS`:

```bash
# Only load project, application, and postgres tools
DOKPLOY_ENABLED_TAGS=project,application,postgres
```

You can also remove categories from a preset:

```bash
DOKPLOY_TOOL_PRESET=core
DOKPLOY_DISABLED_TAGS=postgres,redis
```

If `DOKPLOY_ENABLED_TAGS` is set, it takes precedence over `DOKPLOY_TOOL_PRESET`. `DOKPLOY_DISABLED_TAGS` is applied last.

All tools include semantic annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`) to help MCP clients understand their behavior and safety characteristics.

## Architecture

Built with **@modelcontextprotocol/sdk**, **TypeScript**, and **Zod** for type-safe schema validation:

- **508 Tools** covering the entire Dokploy API
- **Multiple Transports**: Stdio (default) and HTTP (Streamable HTTP + legacy SSE)
- **Auto-generated Tools**: Tools are generated from the Dokploy OpenAPI spec via `pnpm generate:all`
- **Tool Filtering**: Load only the categories you need via `DOKPLOY_ENABLED_TAGS`
- **Robust Error Handling**: Centralized API client with interceptors and retry logic
- **Type Safety**: Full TypeScript with Zod schema validation
- **Tool Annotations**: Semantic hints for MCP client behavior understanding

## Development

Clone the project and install dependencies:

```bash
git clone https://github.com/Dokploy/mcp.git
cd mcp
pnpm install
```

Build:

```bash
pnpm build
```

Regenerate tools from the Dokploy OpenAPI spec:

```bash
pnpm generate:all
```

### Local Configuration Example

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["tsx", "/path/to/mcp/src/index.ts"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Testing with MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @dokploy/mcp
```

## Troubleshooting

### MCP Client Errors

1. Try adding `@latest` to the package name.

2. Make sure you are using Node v18 or higher to have native fetch support with `npx`.

3. Verify your `DOKPLOY_URL` and `DOKPLOY_API_KEY` environment variables are correctly set.

4. If too many tools are loading or your provider times out while processing tools, start with `DOKPLOY_TOOL_PRESET=minimal`, then use `DOKPLOY_ENABLED_TAGS` for exact category filtering if needed.

## Contributing

We welcome contributions! If you'd like to contribute to the Dokploy MCP Server, please check out our [Contributing Guide](CONTRIBUTING.md).

## Support

If you encounter any issues, have questions, or want to suggest a feature, please [open an issue](https://github.com/Dokploy/mcp/issues) in our GitHub repository.

## License

This project is licensed under the [Apache License](LICENSE).
