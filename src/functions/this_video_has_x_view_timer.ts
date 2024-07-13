import { app, InvocationContext, Timer } from "@azure/functions";
import { openSvg } from "./modules/image_handling";

export async function thisVideoHasXViewTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Executing...");
  console.log(openSvg().substring(0, 10) + "...");
  console.log("ENV", process.env);

  const { VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!VIDEO_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return;
  }

  console.log(VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);
}

app.timer("thisVideoHasXViewTimer", {
  schedule: "0 */10 * * * *",
  handler: thisVideoHasXViewTimer,
});
