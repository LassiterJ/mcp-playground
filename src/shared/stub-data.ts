/**
 * @module Shared/StubData
 * @category Shared
 *
 * Shared in-memory dataset used by the `search` and `fetch` tools.
 */

export type StubDoc = {
  id: string;
  title: string;
  text: string;
  url: string;
  metadata?: Record<string, unknown>;
};

export const STUB_DOCS: readonly StubDoc[] = [
  {
    id: "doc-1",
    title: "Cats and Their Homes",
    text:
      "Many domestic cats form strong attachments to places. While often said to be attached to homes rather than humans, current behavior research suggests cats bond with caregivers too.",
    url: "https://example.local/docs/cats-and-homes",
    metadata: { source: "stub", category: "animals" },
  },
  {
    id: "doc-2",
    title: "A Short Guide to Feline Behavior",
    text:
      "Feline behavior includes territory marking, scent communication, and routines. Stability of environment reduces stress and supports healthy attachment.",
    url: "https://example.local/docs/feline-behavior",
    metadata: { source: "stub", category: "behavior" },
  },
  {
    id: "doc-3",
    title: "Environmental Enrichment for Indoor Cats",
    text:
      "Environmental enrichment—perches, hiding spots, and predictable feeding—helps indoor cats feel secure in the home and strengthens positive associations.",
    url: "https://example.local/docs/enrichment",
    metadata: { source: "stub", category: "care" },
  },
];

export function searchDocs(query: string, limit = 5) {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [] as StubDoc[];
  const matches = STUB_DOCS.filter(
    (d) => d.title.toLowerCase().includes(q) || d.text.toLowerCase().includes(q)
  );
  return matches.slice(0, Math.max(1, limit));
}

export function getDocById(id: string) {
  return STUB_DOCS.find((d) => d.id === id);
}


