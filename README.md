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
      "command": {
        "path": "npx",
        "args": ["-y", "@dokploy/mcp"]
      },
      "settings": {
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
| `DOKPLOY_ENABLED_TAGS` | No | Comma-separated list of tags to filter which tools are loaded (e.g., `project,application,postgres`) |
| `DOKPLOY_TIMEOUT` | No | Request timeout in milliseconds (default: `30000`) |
| `DOKPLOY_RETRY_ATTEMPTS` | No | Number of retry attempts (default: `3`) |
| `DOKPLOY_RETRY_DELAY` | No | Delay between retries in milliseconds (default: `1000`) |

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

You can limit which tools are loaded by setting the `DOKPLOY_ENABLED_TAGS` environment variable. This is useful when you only need a subset of tools:

```bash
# Only load project, application, and postgres tools
DOKPLOY_ENABLED_TAGS=project,application,postgres
```

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

4. If too many tools are loading, use `DOKPLOY_ENABLED_TAGS` to filter by category.

## Contributing

We welcome contributions! If you'd like to contribute to the Dokploy MCP Server, please check out our [Contributing Guide](CONTRIBUTING.md).

## Support

If you encounter any issues, have questions, or want to suggest a feature, please [open an issue](https://github.com/Dokploy/mcp/issues) in our GitHub repository.

## License

This project is licensed under the [Apache License](LICENSE).
