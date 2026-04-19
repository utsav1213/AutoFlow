# AutoFlow
A visual workflow automation engine allowing you to create node-based actions triggered by Webhooks, Manual events, and more.

## Quickstart

1. Start the DB: \`docker-compose up -d\` (Ensure Redis + Postgres are running)
2. Sync Prisma: \`npx prisma db push\` && \`npx prisma generate\`
3. Start the Next app: \`npm run dev\`
4. Go to http://localhost:3000/editor to use the graphical workflow designer.

## Features
- **Triggers**: Webhook, Manual, CRON (Available via configurable build settings)
- **Editor**: Powered by \`@xyflow/react\` with Drag & Drop capability.
- **Actions**: Telegram Messages, Resend Email, and robust LLM generation (Anthropic, Gemini, OpenAI).
- **Architecture**: Next.js App Router doing CRUD with PostgreSQL via Prisma, execution engine runs jobs against a BullMQ + Redis task queue.

## Build Options

Within the Reachflow Editor (Left Canvas, Right Sidebar), developers can seamlessly check off options such as \`Exclude CRON\`, \`Exclude LLM action\` etc. These settings dynamically persist for immediate visual exclusion matching developer workflow limits.

## Setting Up Credentials

Via Database/API \`/api/credential\` provide:
- \`platform\`: 'telegram' | 'resend' | 'llm'
- \`data\`: JSON payload including \`token\` (Telegram), \`apiKey\` (Resend), or \`provider\` + \`apiKey\` (LLMs).
