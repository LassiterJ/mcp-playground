import assert from "node:assert";
import { describe, it } from "node:test";
import {
  withTestClient,
  assertToolResponse,
  assertToolError
} from "./helpers/test-client.ts";

describe("Search Tool Integration Tests", () => {
  it("should list search tool", async () => {
    await withTestClient(async (client) => {
      const response = await client.listTools();
      const toolNames = response.tools.map(t => t.name);

      assert(toolNames.includes("search"), "Search tool should be listed");

      const tool = response.tools.find(t => t.name === "search");
      assert.strictEqual(tool?.description, "Search stub documents and return minimal results (id, title, url)");
    });
  });

  it("should process valid input", async () => {
    await withTestClient(async (client) => {
      const response = await client.callTool("search", { query: "cats" });

      // Validate JSON-encoded { results: [...] }
      assertToolResponse(response, (text) => {
        const parsed = JSON.parse(String(text)) as { results: Array<{ id: string; title: string; url: string }> };
        assert(Array.isArray(parsed.results), "results should be an array");
        const first = parsed.results[0];
        if (first !== undefined) {
          assert.strictEqual(typeof first.id, "string");
          assert.strictEqual(typeof first.title, "string");
          assert.strictEqual(typeof first.url, "string");
        }
        return true;
      });
    });
  });

  it("should handle special characters", async () => {
    await withTestClient(async (client) => {
      const response = await client.callTool("search", { query: "Special chars: @#$%^&*() 🚀" });

      assertToolResponse(response, (text) => {
        const parsed = JSON.parse(String(text)) as { results: unknown };
        return Array.isArray((parsed as { results: unknown[] }).results);
      });
    });
  });

  it("should reject missing input parameter", async () => {
    await withTestClient(async (client) => {
      await assertToolError(
        client.callTool("search", {}),
        undefined,
        "Should reject missing query parameter"
      );
    });
  });
});