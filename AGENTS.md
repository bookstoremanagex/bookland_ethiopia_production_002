<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:opencode-project-rules -->
# Project Rules — Bookland Ethiopia

## Startup routine
1. Read all project folders (glob `**/*`) to understand the directory structure
2. Read `files-to-read/session-context.md` to load the current project state
3. Read the most recent file in `files-to-read/conversations/` to understand the last session context
4. After completing steps 1-3, reply with exactly: **"This is a continued conversation"** — so the user knows you've loaded the full context

## Hard restrictions — you MUST obey these
- **NEVER** modify `prisma/schema.prisma`. If you need to read it, ask the user first. You may NOT change any line.
- **NEVER** run `git commit`, `git push`, or any `prisma` CLI commands (npx prisma generate, prisma migrate, etc.)
- **NEVER** install or uninstall npm packages without explicit user permission

## Conversation logging
After every meaningful back-and-forth (at least every 5 exchanges), update the conversation snapshot:
- Save to `files-to-read/conversations/YYYY-MM-DD-HH-MM-SS.md` — one file per conversation session
- Include: date, a brief summary of what was discussed, key decisions made, files changed, and any blockers
- Keep it concise (bullet points, 10-30 lines)

## Architecture notes
- This is a Next.js App Router project with TypeScript
- Uses Prisma ORM with PostgreSQL
- Uses shadcn/ui components via `/components/ui/`
- Tailwind CSS for styling
- Server actions in `/app/actions/`
- Calendar context provider at `/lib/calendar-context.ts`
<!-- END:opencode-project-rules -->
