# The Outer Cortex: n8n Integration Strategy 🧠⚡

> "For as we have many members in one body, and all members have not the same office..." — *Romans 12:4*

While BiblioNexus runs beautifully as a client-side application, integrating **self-hosted n8n** transforms it into a full-stack powerhouse without the complexity of writing a custom backend. We treat n8n as the **"External Cortex,"** handling memory, heavy processing, and connection to the outside world.

## 1. The Architectural Metaphor

*   **BiblioNexus (React):** The **Face & Voice**. It handles interaction, visualization, and immediate inference.
*   **n8n (Self-Hosted):** The **Nervous System**. It handles:
    *   **Long-term Memory** (Vector Database ingestion).
    *   **External Senses** (Web scraping, API access to libraries).
    *   **Heavy Lifting** (Orchestrating complex multi-agent chains).

---

## 2. Integration Pattern: The Synaptic Webhook

The primary communication method is the **Synchronous Webhook**.

### The Flow
1.  **Trigger:** User requests "Deep Historical Analysis" in React.
2.  **Signal:** React POSTs a JSON payload to `https://n8n.your-server.com/webhook/analyze`.
3.  **Processing:** n8n runs a workflow (Search -> RAG -> LLM -> Format).
4.  **Response:** n8n responds with the JSON `AnalysisData` structure expected by our types.

### Security (The Blood-Brain Barrier)
To prevent unauthorized access to your n8n workflows:
*   **Header Auth:** React sends `X-N8N-Auth: <SECRET_KEY>` in the POST request.
*   **CORS:** Configure n8n to allow requests only from your BiblioNexus domain.

---

## 3. Workflow Blueprints (The Wisdom)

Here are three specific workflows ("Scrolls") to implement:

### A. "The Library of Alexandria" (Private RAG) 📚
*Goal: Ground the AI in specific theological texts (e.g., Summa Theologica, Church Fathers) that are too large for a prompt context.*

**Nodes:**
1.  **Webhook:** `POST /query-library` (Input: `topic`).
2.  **Vector Store (Qdrant/Pinecone):** Retrieve top 5 chunks matching `topic`.
3.  **LLM Chain (LangChain):** "Answer `topic` using only these chunks: {{results}}".
4.  **Format:** Map output to `citations` and `theological_insight` fields.
5.  **Respond:** Return JSON.

### B. "The Watchman" (News & Events Grounding) 🌍
*Goal: Connect biblical prophecy or themes to current world events (carefully).*

**Nodes:**
1.  **Webhook:** `POST /watchman` (Input: `prophecy_text`).
2.  **HTTP Request:** Call NewsAPI or Google Search for recent events related to keywords.
3.  **Gemini Node:** "Compare this news event {{news}} with this prophecy {{text}}. Is there a thematic echo?"
4.  **Respond:** Return `cross_references` array with "Modern Echo" connection type.

### C. "The Scribe" (Export & Persistence) ✍️
*Goal: Save analysis results for later study.*

**Nodes:**
1.  **Webhook:** `POST /save-study` (Input: Full `AnalysisData` JSON).
2.  **Notion / Google Docs:** Create a new page titled "{{summary}}".
3.  **Markdown Converter:** Convert JSON to a beautiful Markdown report.
4.  **Email (SMTP):** Send the PDF/Report to the user.
5.  **Respond:** `{ "status": "saved", "url": "..." }`

---

## 4. Implementation Guide

### Step 1: Define the Interface in `services/n8nService.ts`

```typescript
// Proposed Service Structure
export const callN8NWorkflow = async (workflowId: string, payload: any) => {
  const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/${workflowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-Auth': process.env.N8N_SECRET
    },
    body: JSON.stringify(payload)
  });
  return response.json();
};
```

### Step 2: The n8n "Respond to Webhook" Node
**CRITICAL:** You must use the **"Respond to Webhook"** node at the end of your n8n workflow.
*   **Respond With:** JSON
*   **Response Body:** Expression that constructs the exact shape of `AnalysisData` (or a partial update).

### Step 3: Error Handling
If n8n fails or times out (execution time > 2 mins):
*   n8n should return a 500 status.
*   React should catch this and fallback to the direct Gemini API (Graceful Degradation).

---

## 5. Future: The "Living" Database

By connecting n8n to a Postgres database (Supabase), BiblioNexus becomes multi-user:
*   **User Profiles:** Store "Spiritual Journey" history.
*   **Community Notes:** Aggregate insights from multiple users into a shared "Knowledge Graph" stored in Neo4j, managed by n8n.
