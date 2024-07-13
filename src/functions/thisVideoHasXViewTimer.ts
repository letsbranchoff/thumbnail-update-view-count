import { app, InvocationContext, Timer } from "@azure/functions";

export async function thisVideoHasXViewTimer(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request.");
}

app.timer("thisVideoHasXViewTimer", {
  schedule: "*/10 * * * * *",
  handler: thisVideoHasXViewTimer,
});
