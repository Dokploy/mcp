# Dokploy MCP Server - Copilot Instructions

You are an expert in TypeScript, Node.js, Model Context Protocol (MCP), and the @modelcontextprotocol/sdk. You are developing a comprehensive MCP Server that exposes Dokploy API functionalities as tools for AI interactions.

## Project Overview

This is a Model Context Protocol (MCP) Server built with:
- **@modelcontextprotocol/sdk**: Official TypeScript SDK for MCP server development
- **Zod**: Runtime type validation and schema definition
- **Axios**: HTTP client for API communications
- **Express**: HTTP server for MCP transport modes

The server provides tools for managing Dokploy applications, PostgreSQL databases, and projects through standardized MCP interfaces.

## Architecture and Core Concepts

### MCP Server Structure
- **Server Entry Point**: `src/index.ts` - Handles transport mode selection (stdio/http)
- **Server Factory**: `src/server.ts` - Creates and configures the McpServer instance
- **Tool Registry**: `src/mcp/tools/index.ts` - Aggregates all available tools
- **Tool Factory**: `src/mcp/tools/toolFactory.ts` - Provides standardized tool creation

### Tool Organization
- **Application Tools**: `src/mcp/tools/application/` - Dokploy application management
- **PostgreSQL Tools**: `src/mcp/tools/postgres/` - PostgreSQL database management
- **MySQL Tools**: `src/mcp/tools/mysql/` - MySQL database management
- **Project Tools**: `src/mcp/tools/project/` - Project lifecycle management

## Code Standards and Best Practices

### TypeScript Conventions
- Use `const` over `let` for immutable variables
- Prefer arrow functions for conciseness and lexical scoping
- Utilize TypeScript's strict mode and full type system
- Use explicit return types for functions when complexity warrants it
- Implement proper error handling with typed exceptions

### Naming Conventions
- **Files**: Use camelCase (e.g., `applicationCreate.ts`)
- **Variables/Functions**: Use camelCase (e.g., `createServer`, `apiClient`)
- **Types/Interfaces**: Use PascalCase (e.g., `ToolDefinition`, `FormattedResponse`)
- **Constants**: Use SCREAMING_SNAKE_CASE (e.g., `DEFAULT_PORT`)
- **Tool Names**: Use kebab-case with category prefix (e.g., `application-create`, `postgres-deploy`)

### File Organization
- Group related functionality by domain (application, postgres, project)
- Use index files (`index.ts`) for clean module exports
- Separate concerns: tools, utilities, types, and transport logic
- Keep tool implementations focused and single-purpose

## MCP-Specific Guidelines

### Tool Development
Always follow the MCP tool pattern:

```typescript
import { z } from "zod";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const toolName = createTool({
  name: "category-action",
  description: "Clear, concise description of what the tool does.",
  schema: z.object({
    requiredParam: z.string().min(1).describe("Description of parameter"),
    optionalParam: z.string().optional().describe("Optional parameter"),
  }),
  annotations: {
    title: "Human Readable Title",
    destructiveHint: false, // Set true for destructive operations
    idempotentHint: true,  // Set true if safe to retry
    openWorldHint: true,   // Set true if accepts dynamic parameters
  },
  handler: async (input) => {
    // Implementation logic
    const response = await apiClient.post("/endpoint", input);
    return ResponseFormatter.success("Success message", response.data);
  },
});
```

### Schema Design with Zod
- Use descriptive `.describe()` calls for all schema fields
- Implement proper validation with min/max constraints
- Use `.optional()` and `.nullable()` appropriately
- Create reusable schema components for common patterns
- Leverage Zod's built-in validators (email, url, etc.)

### Response Formatting
Always use the `ResponseFormatter` class:
- `ResponseFormatter.success(message, data)` for successful operations
- `ResponseFormatter.error(message, details)` for error conditions
- Include meaningful success messages and structured data
- Ensure error messages are actionable and informative

### Tool Annotations
Use MCP tool annotations to provide hints to clients:
- `destructiveHint: true` - For operations that delete or modify data irreversibly
- `idempotentHint: true` - For operations safe to retry (GET operations, etc.)
- `openWorldHint: true` - For flexible tools accepting dynamic parameters
- `title` - Human-readable title displayed in MCP clients

## Transport Layer Guidelines

### Stdio Transport (Default)
- Primary mode for CLI tools and direct AI assistant integration
- Handle graceful shutdown and error propagation
- Use structured logging for debugging

### HTTP Transport (Optional)
- Support both legacy SSE and modern Streamable HTTP
- Implement proper session management for stateful interactions
- Handle CORS appropriately for web clients
- Use Express middleware for common functionality

## Error Handling and Logging

### Error Patterns
```typescript
try {
  const response = await apiClient.post("/endpoint", data);
  return ResponseFormatter.success("Operation completed", response.data);
} catch (error) {
  logger.error("Operation failed", { error: error.message, data });
  return ResponseFormatter.error(
    "Failed to complete operation", 
    error.response?.data?.message || error.message
  );
}
```

### Logging Standards
- Use the centralized logger from `utils/logger.js`
- Include relevant context in log messages
- Use appropriate log levels (info, warn, error, debug)
- Structure log data for searchability

## API Integration

### HTTP Client Configuration
- Use the centralized `apiClient` from `utils/apiClient.js`
- Implement proper timeout and retry logic
- Handle authentication consistently
- Parse and format API responses appropriately

### Dokploy API Patterns
- Follow Dokploy's REST conventions
- Use proper HTTP methods (POST for creation, GET for retrieval)
- Handle pagination for list operations
- Respect rate limiting and API quotas

## Testing and Quality Assurance

### Unit Testing
- Test tool handlers with mocked API responses
- Validate schema parsing and validation logic
- Test error handling paths
- Use descriptive test names and organize by feature

### Integration Testing
- Test MCP protocol compliance
- Verify transport layer functionality
- Test end-to-end tool execution
- Validate against real Dokploy instances when possible

## Performance and Optimization

### Resource Management
- Implement proper connection pooling for HTTP clients
- Handle memory efficiently in long-running server modes
- Use streaming for large data transfers
- Cache frequently accessed data appropriately

### Scalability Considerations
- Design tools to be stateless where possible
- Implement proper concurrency handling
- Use efficient data structures for large datasets
- Consider rate limiting for resource-intensive operations

## Documentation Standards

### Code Documentation
- Use JSDoc comments for public APIs
- Document complex business logic inline
- Maintain accurate README files
- Include usage examples in tool descriptions

### MCP Tool Documentation
- Provide clear, actionable descriptions
- Include parameter examples in schema descriptions
- Document expected return values and error conditions
- Maintain up-to-date TOOLS.md reference

## Security Considerations

### API Security
- Validate all input parameters rigorously
- Sanitize data before API transmission
- Implement proper authentication token handling
- Use environment variables for sensitive configuration

### MCP Security
- Validate tool permissions and capabilities
- Implement rate limiting where appropriate
- Log security-relevant events
- Handle sensitive data responsibly in responses

## Development Workflow

### Adding New Tools
1. Create tool file in appropriate category directory
2. Implement following the standard tool pattern
3. Add comprehensive Zod schema with descriptions
4. Export from category index file
5. Test thoroughly and document

### Modifying Existing Tools
1. Maintain backward compatibility in schema
2. Update documentation and annotations
3. Test edge cases and error conditions
4. Consider impact on existing MCP clients

### Release Process
1. Update version in package.json
2. Build and test all transport modes
3. Validate MCP protocol compliance
4. Update documentation and changelog
5. Publish to npm registry

## Common Patterns and Anti-Patterns

### ✅ Good Patterns
- Single responsibility tools with clear purposes
- Consistent error handling and response formatting
- Comprehensive input validation with Zod
- Structured logging with contextual information
- Idempotent operations where possible

### ❌ Anti-Patterns
- Tools that perform multiple unrelated operations
- Inconsistent response formats across tools
- Exposing internal API details in tool responses
- Ignoring or swallowing errors silently
- Hardcoded configuration values

## MCP Protocol Compliance

### Tool Registration
- Register all tools through the centralized factory
- Ensure tool names are unique and descriptive
- Provide complete capability advertisements
- Handle tool lifecycle events properly

### Client Compatibility
- Support standard MCP client expectations
- Implement proper protocol versioning
- Handle graceful degradation for unsupported features
- Test with multiple MCP client implementations

## Environment Configuration

### Required Environment Variables
- `DOKPLOY_URL`: Base URL for Dokploy API
- `DOKPLOY_API_KEY`: Authentication token for API access

### Optional Configuration
- `MCP_TRANSPORT`: Transport mode (stdio/http/sse)
- `PORT`: HTTP server port (default: 3000)
- `LOG_LEVEL`: Logging verbosity level

This MCP server should be a robust, type-safe, and user-friendly interface to Dokploy's capabilities, enabling AI assistants and other MCP clients to manage infrastructure seamlessly while maintaining security and reliability standards.