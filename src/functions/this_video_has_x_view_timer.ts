import { app, InvocationContext, Timer } from "@azure/functions";
import {
  openSvg,
  parseSvgStrToXml,
  updateNumberInTemplate,
  saveJsdomAsPNG,
} from "./modules/image_handling";
import {
  getGoogleOAuthClient,
  getYoutubeClient,
  updateVideoTitle,
  updateVideoThumbnail,
  parsePreviousViewsFromTitle,
  fetchVideoDetails,
} from "./modules/youtube_handling";

export async function thisVideoHasXViewTimer(
  _myTimer: Timer,
  _context: InvocationContext
): Promise<void> {
  const { VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!VIDEO_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return;
  }

  const svg = openSvg();
  if (process.exitCode == 1) {
    return;
  }

  const svgAsDom = parseSvgStrToXml(svg);
  updateNumberInTemplate(svgAsDom, 100);
  await saveJsdomAsPNG(svgAsDom);

  const oauth2Client = getGoogleOAuthClient(
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN
  );
  const youtubeClient = getYoutubeClient(oauth2Client);

  fetchVideoDetails(youtubeClient, VIDEO_ID).then(
    async ({ viewCount, title, description }) => {
      const previousViewCount = parsePreviousViewsFromTitle(title);
      if (previousViewCount !== viewCount) {
        updateVideoTitle(youtubeClient, VIDEO_ID, viewCount, description);

        const svgAsDom = parseSvgStrToXml(svg);
        updateNumberInTemplate(svgAsDom, viewCount);
        const thumbnail = await saveJsdomAsPNG(svgAsDom);

        updateVideoThumbnail(youtubeClient, VIDEO_ID, thumbnail);
      }
    }
  );
}

app.timer("thisVideoHasXViewTimer", {
  schedule: "0 */10 * * * *",
  handler: thisVideoHasXViewTimer,
});
