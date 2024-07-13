import { app, InvocationContext, Timer } from "@azure/functions";
import { consoleLog } from "./modules/trail_module";

export async function thisVideoHasXViewTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Executing...");
  const { VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!VIDEO_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return;
  }

  console.log(VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);
}

app.timer("thisVideoHasXViewTimer", {
  schedule: "*/10 * * * * *",
  handler: thisVideoHasXViewTimer,
});
