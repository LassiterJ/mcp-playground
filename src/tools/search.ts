/**
 * @module Tools/Search
 * @category Tools
 */

import { z } from "zod";
import { searchDocs } from "../shared/stub-data.js";
import type { RegisterableModule } from "../registry/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Implements the ChatGPT-required `search` tool.
 *
 * WHY: ChatGPT connectors and Deep Research expect a `search` tool that
 * returns a single content item of type `text` whose payload is a JSON string
 * with `{ results: Array<{ id, title, url }> }`.
 *
 * HOW: We query a tiny in-memory dataset for case-insensitive substring
 * matches and return the top results encoded as JSON in a single text item.
 * This mirrors the protocol shape without external dependencies.
 */
const searchModule: RegisterableModule = {
  type: "tool",
  name: "search",
  description: "Return JSON-encoded search results for stub documents",
  register(server: McpServer) {
    server.tool(
      "search",
      "Search stub documents and return minimal results (id, title, url)",
      {
        query: z.string().describe("Search query string"),
      },
      async (args) => {
        const { query } = args;
        // Perform simple substring search against the stub dataset.
        const matches = searchDocs(query);

        // Map to the minimal result shape required by OpenAI docs.
        const results = matches.map((d) => ({ id: d.id, title: d.title, url: d.url }));

        return {
          content: [
            {
              type: "text",
              // IMPORTANT: ChatGPT expects a JSON-encoded string, not an object
              text: JSON.stringify({ results }),
            },
          ],
        };
      }
    );
  }
};

export default searchModule;
