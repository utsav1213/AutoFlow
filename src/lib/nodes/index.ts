import { executeSentenceSearchNode } from "./ai/sentence-search";
import { executeExtractToTableNode } from "./ai/extract-to-table";
import { executeSummarizeNode } from "./ai/summarize";
import { executeCategorizeNode } from "./ai/categorize";
import { executeTranslateNode } from "./ai/translate";
import { executeScoreNode } from "./ai/score";
import { executeExtractDataNode } from "./ai/extract-data";
import { executeAskAiNode } from "./ai/ask-ai";
import { executeMessagesNode } from "./messaging/messages";
import { executeWhatsappNode } from "./messaging/whatsapp";
import { executeHackernewsNode } from "./social/hackernews";
import { executePostgresqlNode } from "./database/postgresql";
import { executeRedditNode } from "./social/reddit";
import { executeXNode } from "./social/x";
import { executeYoutubeNode } from "./social/youtube";
import { executeDiscordNode } from "./messaging/discord";
import { executeApifyNode } from "./web/apify";
import { executeTypeformNode } from "./productivity/typeform";
import { executeLinkedinNode } from "./social/linkedin";
import { executeOutlookNode } from "./messaging/outlook";
import { executeGoogleNode } from "./web/google";
import { executeGsheetsNode } from "./productivity/gsheets";
import { executeGdocsNode } from "./productivity/gdocs";
import { executeGdriveNode } from "./productivity/gdrive";
import { executeCalendarNode } from "./productivity/calendar";
import { executeSupabaseNode } from "./database/supabase";
import { executeAirtableNode } from "./database/airtable";
import { executeNotionNode } from "./productivity/notion";
import { executeGmailNode } from "./messaging/gmail";
import { NodeExecutorResult } from "./types";
import { execute as conditionExecutor } from "./core/condition";
import { execute as loopExecutor } from "./core/loop";
import { execute as delayExecutor } from "./core/delay";
import { execute as codeExecutor } from "./core/code";
import { execute as telegramExecutor } from "./messaging/telegram";
import { execute as resendExecutor } from "./messaging/resend";
import { execute as llmExecutor } from "./ai/llm";
import { execute as httpExecutor } from "./web/http";
import { execute as scraperExecutor } from "./web/scraper";
import { execute as sqlExecutor } from "./database/sql";
import { execute as storageExecutor } from "./database/storage";

export const executors: Record<string, (node: any, inputData: any) => Promise<NodeExecutorResult>> = {
  condition: conditionExecutor,
  loop: loopExecutor,
  delay: delayExecutor,
  code: codeExecutor,
  telegram: telegramExecutor,
  resend: resendExecutor,
  llm: llmExecutor,
  http: httpExecutor,
  scraper: scraperExecutor,
  sql: sqlExecutor,
  storage: storageExecutor,
};
