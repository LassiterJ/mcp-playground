/**
 * @module Tools/Fetch
 * @category Tools
 */

import { z } from "zod";
import type { RegisterableModule } from "../registry/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDocById } from "../shared/stub-data.js";

/**
 * Implements the ChatGPT-required `fetch` tool.
 *
 * WHY: After `search`, ChatGPT calls `fetch` with a document id to retrieve the
 * full content for citation. The result must be a single content item of type
 * `text` whose payload is a JSON string with `{ id, title, text, url, metadata }`.
 *
 * HOW: We look up the id in our in-memory dataset and return the complete
 * document in the required shape, JSON-encoded in a single text item.
 */
const fetchModule: RegisterableModule = {
  type: "tool",
  name: "fetch",
  description: "Return JSON-encoded full document for a given id",
  register(server: McpServer) {
    server.tool(
      "fetch",
      "Fetch a stub document by id and return full text",
      {
        id: z.string().describe("Unique identifier of a search result document"),
      },
      async (args) => {
        const { id } = args;
        const doc = getDocById(id);

        if (!doc) {
          // Explicit error helps clients display a clear failure reason.
          throw new Error(`Document not found: ${id}`);
        }

        const payload = {
          id: doc.id,
          title: doc.title,
          text: doc.text,
          url: doc.url,
          metadata: doc.metadata ?? { source: "stub" },
        };

        return {
          content: [
            {
              type: "text",
              // IMPORTANT: ChatGPT expects a JSON-encoded string, not an object
              text: JSON.stringify(payload),
            },
          ],
        };
      }
    );
  }
};

export default fetchModule;