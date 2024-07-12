import {
  openSvg,
  parseSvgStrToXml,
  updateNumberInTemplate,
  saveJsdomAsPNG,
} from "./functions/image_handling";
import {
  getGoogleOAuthClient,
  getYoutubeClient,
  fetchVideoDetails,
  parsePreviousViewsFromTitle,
  updateVideoTitle,
  updateVideoThumbnail,
} from "./functions/youtube_handling";

module.exports = async function () {
  const { VIDEO_ID, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!VIDEO_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return;
  }

  const svg = openSvg();
  if (process.exitCode == 1) {
    return;
  }

  const oauth2Client = getGoogleOAuthClient(
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN
  );
  const youtubeClient = getYoutubeClient(oauth2Client);

  fetchVideoDetails(youtubeClient, VIDEO_ID).then(
    async ({ viewCount, title }) => {
      const previousViewCount = parsePreviousViewsFromTitle(title);
      if (previousViewCount !== viewCount) {
        updateVideoTitle(youtubeClient, VIDEO_ID, viewCount);

        const svgAsDom = parseSvgStrToXml(svg);
        updateNumberInTemplate(svgAsDom, viewCount);
        await saveJsdomAsPNG(svgAsDom);

        updateVideoThumbnail(youtubeClient, VIDEO_ID);
      }
    }
  );
};
