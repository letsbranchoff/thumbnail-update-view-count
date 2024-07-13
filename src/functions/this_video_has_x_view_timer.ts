import { app, InvocationContext, Timer } from "@azure/functions";
import { consoleLog } from "./modules/trail_module";

export async function thisVideoHasXViewTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request.");
  consoleLog();
}

app.timer("thisVideoHasXViewTimer", {
  schedule: "*/10 * * * * *",
  handler: thisVideoHasXViewTimer,
});
