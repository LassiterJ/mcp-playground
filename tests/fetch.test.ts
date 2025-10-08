import assert from "node:assert";
import { describe, it } from "node:test";
import {
  withTestClient,
  assertToolResponse,
  assertToolError
} from "./helpers/test-client.ts";

describe("Fetch Tool Integration Tests", () => {
  it("should list fetch tool", async () => {
    await withTestClient(async (client) => {
      const response = await client.listTools();
      const toolNames = response.tools.map(t => t.name);

      assert(toolNames.includes("fetch"), "Fetch tool should be listed");

      const tool = response.tools.find(t => t.name === "fetch");
      assert.strictEqual(tool?.description, "Fetch a stub document by id and return full text");
    });
  });

  it("should process valid input", async () => {
    await withTestClient(async (client) => {
      const response = await client.callTool("fetch", { id: "doc-1" });

      assertToolResponse(response, (text) => {
        const doc = JSON.parse(String(text)) as { id: string; title: string; text: string; url: string; metadata?: unknown };
        return doc.id === "doc-1" && typeof doc.title === "string" && typeof doc.text === "string" && typeof doc.url === "string";
      });
    });
  });

  it("should handle special characters", async () => {
    await withTestClient(async (client) => {
      const response = await client.callTool("fetch", { id: "doc-1" });

      assertToolResponse(response, (text) => {
        const doc = JSON.parse(String(text)) as { id: string };
        return doc.id === "doc-1";
      });
    });
  });

  it("should reject missing input parameter", async () => {
    await withTestClient(async (client) => {
      await assertToolError(
        client.callTool("fetch", {}),
        undefined,
        "Should reject missing id parameter"
      );
    });
  });
});