# AI Customer Support Refund Agent

This is a self-contained Next.js app that demonstrates an AI-guided refund decision workflow using tool calling, a LangGraph-style state graph, policy enforcement, and live observability.

## What’s included

- Voice-enabled chat interface with speech recognition and speech synthesis
- Structured workflow logging for every agent state, tool call, policy evaluation, and error
- Admin observability dashboard with timeline, policy inspection, tool latency metrics, and decision history
- Demo order records for approved, denied, clearance, digital, fraud, and defective scenarios
- OpenAI-powered explanation generation with fallback reasoning when API key is missing

## Quick start

1. Copy `.env.example` to `.env` and add your `OPENAI_API_KEY`.
2. Install dependencies:

```bash
cd refund-agent
npm install
```

3. Run dev server:

```bash
npm run dev
```

4. Open the app:

- `/chat` for the voice-enabled customer refund assistant
- `/admin` for observability, timeline, and policy dashboards

## Notes

- If `OPENAI_API_KEY` is not set, the app falls back to deterministic policy-based explanations.
- Logs are stored in memory for demo purposes and are refreshed live in the admin UI.
- Use order IDs like `ORD-001` through `ORD-030` in the chat prompt, or `ORD-APPROVED-001` style if added in your data.
