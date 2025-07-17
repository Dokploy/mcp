import { z, ZodObject, ZodRawShape } from "zod";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

// 🚀 ADVANCED AI ASSISTANCE SYSTEM - Enhanced Error Handling for Claude Code Integration

// Track tool call attempts with detailed analysis
interface AttemptRecord {
  count: number;
  lastInput: any;
  errorMessages: string[];
  patterns: string[];
  firstAttempt: Date;
  lastAttempt: Date;
}

const attemptTracker = new Map<string, AttemptRecord>();
const patternHistory = new Map<string, string[]>();

// Intelligence system for detecting AI behavior patterns
class AIBehaviorAnalyzer {
  static analyzeAttempt(toolName: string, input: any, errorMessage?: string): {
    patterns: string[];
    suggestions: string[];
    correctedExample?: any;
    escalationNeeded: boolean;
  } {
    const key = `${toolName}-${JSON.stringify(input).substring(0, 100)}`;
    const record = attemptTracker.get(key) || {
      count: 0,
      lastInput: null,
      errorMessages: [],
      patterns: [],
      firstAttempt: new Date(),
      lastAttempt: new Date()
    };

    record.count++;
    record.lastInput = input;
    record.lastAttempt = new Date();
    
    if (errorMessage) {
      record.errorMessages.push(errorMessage);
    }

    // Detect patterns
    const detectedPatterns: string[] = [];
    const suggestions: string[] = [];
    let correctedExample: any = undefined;
    let escalationNeeded = false;

    // Pattern 1: Repeated same syntax
    if (record.count >= 3 && JSON.stringify(input) === JSON.stringify(record.lastInput)) {
      detectedPatterns.push("repeated_same_syntax");
      suggestions.push("🔄 PATTERN DETECTED: You're repeating the same syntax. Try: mcp__dokploy-mcp__tool-examples()");
    }

    // Pattern 2: Missing required parameters
    if (!input || Object.keys(input).length === 0) {
      detectedPatterns.push("missing_required_params");
      correctedExample = AIBehaviorAnalyzer.generateCorrectedExample(toolName);
      suggestions.push("📋 AUTO-CORRECTION: Here's the correct format with required parameters");
    }

    // Pattern 3: Wrong parameter format
    const inputStr = JSON.stringify(input);
    if (inputStr.includes('(') && inputStr.includes(')') && !inputStr.includes('"')) {
      detectedPatterns.push("wrong_parameter_format");
      suggestions.push("⚠️ FORMAT ERROR: Use XML parameters, not JavaScript function syntax");
    }

    // Pattern 4: Ignoring error messages
    if (record.errorMessages.length >= 3) {
      const similarErrors = record.errorMessages.filter(msg => 
        msg.includes('XML syntax') || msg.includes('parameter')
      ).length;
      
      if (similarErrors >= 3) {
        detectedPatterns.push("ignoring_error_messages");
        escalationNeeded = true;
        suggestions.push("🚨 ESCALATION: Multiple identical errors. Switch to BEGINNER MODE");
      }
    }

    record.patterns = [...new Set([...record.patterns, ...detectedPatterns])];
    attemptTracker.set(key, record);
    
    return {
      patterns: detectedPatterns,
      suggestions,
      correctedExample,
      escalationNeeded
    };
  }

  static generateCorrectedExample(toolName: string): any {
    const examples: Record<string, any> = {
      'project-create': { name: 'my-project' },
      'application-create': { name: 'my-app', projectId: 'abc123xyz' },
      'postgres-create': { 
        name: 'my-postgres', 
        appName: 'postgres-app', 
        databaseName: 'mydb',
        databaseUser: 'user',
        databasePassword: 'password',
        projectId: 'abc123xyz'
      },
      'mysql-create': {
        name: 'my-mysql',
        appName: 'mysql-app',
        databaseName: 'mydb',
        databaseUser: 'user', 
        databasePassword: 'password',
        databaseRootPassword: 'rootpass',
        projectId: 'abc123xyz'
      }
    };
    
    return examples[toolName] || { name: 'example-value' };
  }

  static generateBeginnerModeHelp(toolName: string): string {
    return `
🎓 BEGINNER MODE ACTIVATED

📚 Step-by-step guide for ${toolName}:

1️⃣ FIRST: Use tool-examples to see all available tools
   mcp__dokploy-mcp__tool-examples()

2️⃣ SECOND: See specific example for this tool
   mcp__dokploy-mcp__tool-examples(tool: "${toolName}")

3️⃣ THIRD: Use validate-call to test your parameters
   mcp__dokploy-mcp__validate-call(tool: "${toolName}", params: {"name": "test"})

4️⃣ FOURTH: Use the correct XML syntax:
   <function_calls>
     <invoke name="mcp__dokploy-mcp__${toolName}">
       <parameter name="name">your-value</parameter>
     </invoke>
   </function_calls>

💡 TIP: MCP uses XML, not JavaScript function calls!`;
  }

  static generateAutoCorrection(toolName: string, correctedExample: any): string {
    const params = Object.entries(correctedExample)
      .map(([key, value]) => `       <parameter name="${key}">${value}</parameter>`)
      .join('\n');
    
    return `
🔧 AUTO-CORRECTION GENERATED

❌ Wrong: mcp__dokploy-mcp__${toolName}()
✅ Correct XML syntax:

<function_calls>
  <invoke name="mcp__dokploy-mcp__${toolName}">
${params}
  </invoke>
</function_calls>

📖 Required parameters: ${Object.keys(correctedExample).join(', ')}`;
  }

  static generateContextualHint(toolName: string, _errorMessage: string, attempts: number): string {
    if (attempts === 1) {
      return `\n💡 HINT: MCP tools use XML parameter format, not JavaScript function calls`;
    } else if (attempts === 2) {
      return `\n🔍 ANALYSIS: You've tried ${attempts} times. The error suggests checking the XML parameter format.`;
    } else if (attempts >= 3) {
      return `\n⚠️ PATTERN DETECTED: ${attempts} attempts with similar errors. Consider using mcp__dokploy-mcp__tool-examples() first.`;
    }
    
    return `\n💭 Need help? Try: mcp__dokploy-mcp__tool-examples(tool: "${toolName}")`;
  }
}

// Reset trackers periodically
setInterval(() => {
  attemptTracker.clear();
  patternHistory.clear();
}, 10 * 60 * 1000); // Reset every 10 minutes

// Updated to match MCP SDK response format
export type ToolHandler<T> = (input: T) => Promise<{
  content: { type: "text"; text: string }[];
  isError?: boolean;
}>;

// Defines the structure for a tool.
export interface ToolDefinition<TShape extends ZodRawShape> {
  name: string;
  description: string;
  schema: ZodObject<TShape>;
  handler: ToolHandler<z.infer<ZodObject<TShape>>>;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

interface ToolContext {
  apiClient: typeof apiClient;
  logger: ReturnType<typeof createLogger>;
}

const logger = createLogger("ToolFactory");

// 🧠 INTELLIGENT ERROR MESSAGE SYSTEM with AI Pattern Recognition
function getIntelligentErrorMessage(originalMessage: string, toolName: string, input: any, attempts: number): string {
  const analysis = AIBehaviorAnalyzer.analyzeAttempt(toolName, input, originalMessage);
  
  let message = originalMessage;
  
  if (analysis.suggestions.length > 0) {
    message += `\n\n` + analysis.suggestions.join('\n');
  }
  
  if (analysis.correctedExample) {
    message += AIBehaviorAnalyzer.generateAutoCorrection(toolName, analysis.correctedExample);
  }
  
  message += AIBehaviorAnalyzer.generateContextualHint(toolName, originalMessage, attempts);
  
  if (analysis.escalationNeeded) {
    message += AIBehaviorAnalyzer.generateBeginnerModeHelp(toolName);
  }
  
  message += `\n\n🧪 DRY RUN: Test your parameters first:\nmcp__dokploy-mcp__validate-call(tool: "${toolName}", params: {"name": "test"})`;
  
  return message;
}

export function createToolContext(): ToolContext {
  return {
    apiClient,
    logger,
  };
}

export function createTool<TShape extends import("zod").ZodRawShape>(
  definition: ToolDefinition<TShape>
): ToolDefinition<TShape> {
  return {
    ...definition,
    handler: async (input) => {
      const context = createToolContext();

      try {
        const validationResult = definition.schema.safeParse(input);
        if (!validationResult.success) {
          context.logger.warn(
            `Input validation failed for tool: ${definition.name}`,
            {
              errors: validationResult.error.errors,
              input,
            }
          );

          // Use zod-validation-error for user-friendly messages
          const { fromZodError } = await import("zod-validation-error");
          const validationError = fromZodError(validationResult.error, {
            prefix: "Validation failed",
            prefixSeparator: ": ",
            issueSeparator: "; ",
            unionSeparator: ", or ",
            includePath: true,
          });

          // Track repetitive behavior
          const attemptKey = `${definition.name}-${JSON.stringify(input)}`;
          const currentRecord = attemptTracker.get(attemptKey);
          const attempts = currentRecord ? currentRecord.count : 0;
          
          if (currentRecord) {
            currentRecord.count = attempts + 1;
            currentRecord.lastAttempt = new Date();
            currentRecord.errorMessages.push(validationError.message);
          } else {
            attemptTracker.set(attemptKey, {
              count: 1,
              lastInput: input,
              errorMessages: [validationError.message],
              patterns: [],
              firstAttempt: new Date(),
              lastAttempt: new Date()
            });
          }

          // Create intelligent error message with AI assistance
          let intelligentMessage = getIntelligentErrorMessage(
            validationError.message, 
            definition.name, 
            input,
            attempts + 1
          );
          
          // Add behavioral analysis warning
          const analysis = AIBehaviorAnalyzer.analyzeAttempt(definition.name, input, validationError.message);
          if (analysis.patterns.length > 0) {
            intelligentMessage += `\n\n🔍 BEHAVIOR ANALYSIS: Detected patterns: ${analysis.patterns.join(', ')}`;
            intelligentMessage += `\n📊 Attempt #${attempts + 1} - Pattern recognition active`;
          }

          return ResponseFormatter.error(
            `🤖 AI Assistant: Invalid input for tool: ${definition.name}`,
            intelligentMessage
          );
        }

        context.logger.info(`Executing tool: ${definition.name}`, {
          input: validationResult.data,
        });
        const result = await definition.handler(validationResult.data);
        context.logger.info(`Tool executed successfully: ${definition.name}`);
        return result;
      } catch (error) {
        context.logger.error(`Tool execution failed: ${definition.name}`, {
          error: error instanceof Error ? error.message : "Unknown error",
          input,
        });

        if (error instanceof Error) {
          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            return ResponseFormatter.error(
              `Authentication failed for tool: ${definition.name}`,
              "Please check your DOKPLOY_API_KEY configuration"
            );
          }

          if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            return ResponseFormatter.error(
              `Resource not found`,
              `The requested resource for ${definition.name} could not be found`
            );
          }

          if (
            error.message.includes("500") ||
            error.message.includes("Internal Server Error")
          ) {
            return ResponseFormatter.error(
              `Server error occurred`,
              `Dokploy server encountered an internal error while processing ${definition.name}`
            );
          }
        }

        return ResponseFormatter.error(
          `Failed to execute tool: ${definition.name}`,
          `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
        );
      }
    },
  };
}