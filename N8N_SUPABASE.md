# The Chronicle: Supabase & n8n Persistence Layer 🏛️

> "Write the vision, and make it plain upon tables..." — *Habakkuk 2:2*

To transform BiblioNexus from a transient session tool into a **Life-Long Study Companion**, we need a persistence layer. **Supabase (PostgreSQL)** is the ideal choice because it combines the flexibility of JSON documents with the power of relational queries and vector search (`pgvector`).

---

## 1. The Schema Strategy: Hybrid JSONB

Since our `AnalysisData` type is complex (nested arrays for `timeline`, `codons`, `council_transcript`), normalizing this into strict SQL tables (e.g., `table_timeline_events`, `table_bio_codons`) would be overkill and hard to maintain.

**The Solution:** Use PostgreSQL `JSONB` columns to store the analysis payload, but extract key metadata for indexing.

### SQL Setup Script

Run this in your Supabase SQL Editor to initialize "The Chronicle":

```sql
-- Enable Vector extension for RAG features later
create extension if not exists vector;

-- 1. Profiles (Linked to Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  username text,
  spiritual_bio text,
  created_at timestamptz default now()
);

-- 2. Study Sessions (The "Log")
create table study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  topic text not null,
  language text default 'English',
  
  -- The "Golden Nugget": Stores the full AnalysisData object
  analysis_payload jsonb, 
  
  -- Metadata extracted for fast filtering
  primary_theme text,
  fidelity_score int, -- From Mistral Review
  
  -- For Vector Search (embedding of the summary)
  embedding vector(1536),
  
  created_at timestamptz default now()
);

-- 3. Global Knowledge Graph (Optional: Advanced)
-- We extract cross-references to build a massive graph of all user discoveries
create table global_connections (
  id bigint generated always as identity primary key,
  source_ref text,
  target_ref text,
  connection_type text,
  discovered_count int default 1,
  last_seen timestamptz default now()
);
```

---

## 2. n8n Workflows: The Scribe

We do not write to Supabase directly from React (for security and complexity reasons). We use n8n as the "Scribe."

### Workflow A: "Preserve Wisdom" (Save Analysis)

**Trigger:** Webhook `POST /chronicle/save`
**Payload:** `{ userId, topic, analysisData }`

**Nodes:**
1.  **Webhook Node:** Receive data.
2.  **Mistral/OpenAI Node (Optional):** Generate an embedding vector from `analysisData.summary`.
3.  **Supabase Node (Insert):**
    *   Table: `study_sessions`
    *   Map Fields:
        *   `user_id` = `{{body.userId}}`
        *   `topic` = `{{body.topic}}`
        *   `analysis_payload` = `{{body.analysisData}}` (JSON)
        *   `primary_theme` = `{{body.analysisData.themes[0].name}}`
        *   `fidelity_score` = `{{body.analysisData.peer_review.agreement_score}}`
        *   `embedding` = `{{embedding_vector}}`
4.  **Respond Node:** `{ success: true, id: "{{supabase_id}}" }`

### Workflow B: "Recall Memory" (Search History)

**Trigger:** Webhook `GET /chronicle/search?q=Grace`

**Nodes:**
1.  **Webhook Node:** Receive query `q`.
2.  **Supabase Node (Execute Query):**
    *   **Method:** "Execute Query" (Power of JSONB!)
    *   **Query:**
        ```sql
        SELECT id, topic, analysis_payload->>'summary' as summary, created_at
        FROM study_sessions
        WHERE user_id = $1
        AND (
           topic ILIKE $2 
           OR 
           -- Search INSIDE the JSON blob!
           analysis_payload->'themes' @> '[{"name": "Grace"}]'
        )
        ORDER BY created_at DESC
        LIMIT 10;
        ```
3.  **Respond Node:** Return list of past studies.

---

## 3. Why this is the "Better Way"

### The "Data Lake" Approach
Instead of forcing the rigid biological/4D structure into tables, we dump the rigid structure into `jsonb`.
*   **Pros:** If you change the frontend TypeScript types (e.g., adding `etymology` data), you **do not** need to migrate the database schema. You just save the new JSON.
*   **Cons:** Updating a specific field inside the JSON is slightly harder (but rarely needed here).

### The Vector Advantage
By storing the `embedding` alongside the JSON:
1.  User asks: *"What did I learn about the Levitical Priesthood last month?"*
2.  n8n converts query to vector.
3.  Supabase performs a Similarity Search.
4.  It returns the exact Study Session, even if the user didn't use the exact keywords.

## 4. Implementation Steps

1.  **Create Project:** Go to [Supabase.com](https://supabase.com) and create a project.
2.  **Run SQL:** Copy the SQL script above into the SQL Editor.
3.  **Connect n8n:**
    *   Add "Supabase" credentials in n8n (Host, Service Role Key).
    *   Build the "Preserve Wisdom" workflow.
4.  **Update React App:**
    *   Add a "Save to Chronicle" button in the Dashboard header.
    *   Call the n8n webhook on click.
