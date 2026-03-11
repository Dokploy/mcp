# Dokploy MCP Server

[![npm version](https://img.shields.io/npm/v/@ahdev/dokploy-mcp.svg)](https://www.npmjs.com/package/@ahdev/dokploy-mcp) [<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Dokploy%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40ahdev%2Fdokploy-mcp%40latest%22%5D%7D)

Dokploy MCP Server exposes Dokploy functionalities as tools consumable via the Model Context Protocol (MCP). It allows MCP-compatible clients (e.g., AI models, other applications) to interact with your Dokploy server programmatically.

This server focuses exclusively on **tools** for direct Dokploy API operations, providing a clean and efficient interface for project and application management.

## 🛠️ Getting Started

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
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
      "args": ["run", "--allow-env", "--allow-net", "npm:@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in VS Code

[<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Dokploy%20MCP&color=0098FF">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40ahdev%2Fdokploy-mcp%40latest%22%5D%7D)
[<img alt="Install in VS Code Insiders (npx)" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Dokploy%20MCP&color=24bfa5">](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22dokploy-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40ahdev%2Fdokploy-mcp%40latest%22%5D%7D)

Add this to your VS Code MCP config file. See [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

```json
{
  "servers": {
    "dokploy-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Install in Zed

Add this to your Zed `settings.json`. See [Zed Context Server docs](https://zed.dev/docs/assistant/context-servers) for more info.

```json
{
  "context_servers": {
    "dokploy-mcp": {
      "command": {
        "path": "npx",
        "args": ["-y", "@ahdev/dokploy-mcp"]
      },
      "settings": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
      "args": ["-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
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
    cd dokploy-mcp
    docker build -t dokploy-mcp .
    ```

2.  **Manual Docker Commands:**

    **Stdio Mode (for MCP clients):**

    ```bash
    docker run -it --rm \
      -e DOKPLOY_URL=https://your-dokploy-server.com/api \
      -e DOKPLOY_API_KEY=your_token_here \
      dokploy-mcp
    ```

    **HTTP Mode (for web applications):**

    ```bash
    docker run -it --rm \
      -p 8080:3000 \
      -e MCP_TRANSPORT=http \
      -e DOKPLOY_URL=https://your-dokploy-server.com/api \
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
            "DOKPLOY_URL=https://your-dokploy-server.com/api",
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
      "args": ["/c", "npx", "-y", "@ahdev/dokploy-mcp"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Environment Variables

- `DOKPLOY_URL`: Your Dokploy server API URL (required)
- `DOKPLOY_API_KEY`: Your Dokploy API authentication token (required)

## 🚀 Transport Modes

This MCP server supports multiple transport modes to suit different use cases:

### Stdio Mode (Default)

The default mode uses stdio for direct process communication, ideal for desktop applications and command-line usage.

```bash
# Run with stdio (default)
npx -y @ahdev/dokploy-mcp
# or
npm run start:stdio
```

### HTTP Mode (Streamable HTTP + Legacy SSE)

Modern HTTP mode exposes the server via HTTP/HTTPS supporting **both modern and legacy protocols** for maximum compatibility:

- **Streamable HTTP (MCP 2025-03-26)** - Modern protocol with session management
- **Legacy SSE (MCP 2024-11-05)** - Backwards compatibility for older clients

```bash
# Run with HTTP mode
npm run start:http
# or
npx -y @ahdev/dokploy-mcp --http
# or via environment variable
MCP_TRANSPORT=http npx -y @ahdev/dokploy-mcp
```

**Modern Streamable HTTP Endpoints:**

- **POST /mcp** - Client-to-server requests
- **GET /mcp** - Server-to-client notifications
- **DELETE /mcp** - Session termination
- **GET /health** - Health check endpoint

**Legacy SSE Endpoints (Backwards Compatibility):**

- **GET /sse** - SSE stream initialization
- **POST /messages** - Client message posting

**Configuration:**

- Internal port: `3000` (fixed)
- External port: configurable via `EXTERNAL_PORT` (default: `3000`)
- Supports both modern Streamable HTTP (MCP 2025-03-26) and legacy SSE (MCP 2024-11-05)
- Session management with automatic cleanup for both transport types

**Client Compatibility:**

Modern clients automatically use the Streamable HTTP endpoints, while legacy clients can connect using the SSE endpoints. The server handles both protocols simultaneously, ensuring compatibility with:

- **Modern MCP clients** (Claude Desktop, Cline, etc.) → Use `/mcp` endpoints
- **Legacy MCP clients** → Use `/sse` and `/messages` endpoints
- **Custom integrations** → Choose the appropriate protocol for your needs

For detailed transport mode documentation and client examples, refer to the configuration examples above.

## 📚 Available Tools

This MCP server exposes **2 tools** that provide full coverage of the entire Dokploy API (300+ operations):

### `dokploy-api` — Execute any Dokploy API operation

A single, generic tool that can call any Dokploy API endpoint. The HTTP method (GET/POST) is **auto-detected from the live OpenAPI spec** — no static configuration to maintain.

```json
{ "operation": "application.create", "params": { "name": "my-app", "projectId": "..." } }
{ "operation": "project.all" }
{ "operation": "settings.health" }
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operation` | string | Yes | API operation path, e.g. `"application.create"`, `"server.one"` |
| `params` | object | No | Parameters — sent as JSON body (POST) or query string (GET) |

### `dokploy-api-schema` — Discover operations and parameters

Introspects the Dokploy OpenAPI spec to list available categories, operations, and their full parameter schemas. Call with no params for a category overview, with `category` to list operations, or with `operation` for full parameter details.

```json
{}                                          // → list all categories
{ "category": "application" }               // → list operations in category
{ "operation": "application.create" }       // → full parameter schema
```

### Why 2 tools instead of 300+?

Previous versions registered a separate MCP tool for every API endpoint. This created maintenance overhead — every Dokploy update required manually adding new tools. The current architecture derives everything from the live OpenAPI spec at startup:

- **Zero maintenance**: New Dokploy API endpoints are available automatically
- **Accurate method detection**: GET vs POST determined from the spec, not a static list
- **Rich discovery**: The schema tool resolves `$ref`, `allOf`, `oneOf` so AI clients get complete parameter information
- **Full coverage**: Every operation Dokploy exposes is accessible, not just a curated subset

**Tool Annotations:** Both tools include semantic annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) to help MCP clients understand their behavior.

For detailed documentation, see **[TOOLS.md](TOOLS.md)**.

## 🏗️ Architecture

Built with **@modelcontextprotocol/sdk**, **TypeScript**, and **Zod** for type-safe schema validation:

- **2 Tools, Full API Coverage**: A generic executor + schema discovery tool covering 300+ Dokploy operations
- **Dynamic OpenAPI Spec Derivation**: GET/POST method detection, operation lists, and parameter schemas are all derived from the live Dokploy OpenAPI spec at startup — cached after first fetch
- **Multiple Transports**: Stdio (default) and HTTP (Streamable HTTP + legacy SSE)
- **Structured Error Handling**: Status-specific error messages (400/401/403/404/422/5xx) that surface Dokploy's actual validation details
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Tool Annotations**: Semantic hints for MCP client behavior understanding

### Key Files

| File | Purpose |
|------|---------|
| `src/mcp/tools/api.ts` | Generic API executor — routes any operation to the correct endpoint |
| `src/mcp/tools/apiSchema.ts` | Schema discovery — resolves `$ref`, `allOf`, `oneOf` from OpenAPI spec |
| `src/utils/openApiSpec.ts` | Shared OpenAPI spec cache — single fetch, used by both tools |
| `src/server.ts` | MCP server setup and tool registration |
| `src/http-server.ts` | Express server with Streamable HTTP + legacy SSE transport |

## 🔧 Development

Clone the project and install dependencies:

```bash
git clone https://github.com/Dokploy/mcp.git
cd dokploy-mcp
npm install
```

Build:

```bash
npm run build
```

### Local Configuration Example

```json
{
  "mcpServers": {
    "dokploy-mcp": {
      "command": "npx",
      "args": ["tsx", "/path/to/dokploy-mcp/src/index.ts"],
      "env": {
        "DOKPLOY_URL": "https://your-dokploy-server.com/api",
        "DOKPLOY_API_KEY": "your-dokploy-api-token"
      }
    }
  }
}
```

### Testing with MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @ahdev/dokploy-mcp
```

### Documentation

- **[TOOLS.md](TOOLS.md)** - Complete tool reference with schemas and examples
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines

## 🔧 Troubleshooting

### MCP Client Errors

1. Try adding `@latest` to the package name.

2. Make sure you are using Node v18 or higher to have native fetch support with `npx`.

3. Verify your `DOKPLOY_URL` and `DOKPLOY_API_KEY` environment variables are correctly set.

## 🤝 Contributing

We welcome contributions! If you'd like to contribute to the Dokploy MCP Server, please check out our [Contributing Guide](CONTRIBUTING.md).

## 🆘 Support

If you encounter any issues, have questions, or want to suggest a feature, please [open an issue](https://github.com/Dokploy/mcp/issues) in our GitHub repository.

## 📄 License

This project is licensed under the [Apache License](LICENSE).
