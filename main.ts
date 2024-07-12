import fs from "node:fs";
import jsdom from "jsdom";
import sharp from "sharp";
import { google, youtube_v3 } from "googleapis";

const { JSDOM } = jsdom;

function openSvg(path = "./assets/thumbnail-template.svg"): string {
  try {
    return fs.readFileSync((path = path), "utf8");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

function parseSvgStrToXml(svg_str: string) {
  return new JSDOM(svg_str);
}

function updateNumberInThumbnail(dom: jsdom.JSDOM, val: number) {
  dom.window.document.getElementById("viewCount").innerHTML =
    val.toLocaleString();
}

async function saveJsdomAsPNG(dom: jsdom.JSDOM, dir = "./output") {
  let svgString = dom.window.document.getElementsByTagName("body")[0].innerHTML;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await sharp(Buffer.from(svgString)).png().toFile(`${dir}/thumbnail.png`);
}

function getGoogleOAuthClient(
  clientId: string,
  clientSecret: string,
  refreshToken: string
) {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

function getYoutubeClient(oauth2Client) {
  return google.youtube({ version: "v3", auth: oauth2Client });
}

async function fetchVideoDetails(client: youtube_v3.Youtube, videoId: string) {
  const res = await client.videos.list({
    id: [videoId],
    part: ["statistics", "snippet"],
  });
  const { data } = res;
  const { statistics, snippet } = data.items[0];
  return {
    viewCount: parseInt(statistics.viewCount) ?? 0,
    title: snippet.title ?? "",
  };
}

function parsePreviousViewsFromTitle(title: string) {
  const re = /has (.*) views\./;
  const titleRegexMatches = title.match(re);
  return parseInt(titleRegexMatches[1].replace(/,/g, ""));
}

function updateVideoTitle(
  client: youtube_v3.Youtube,
  videoId: string,
  viewCount: number
) {
  client.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        title: `This video has ${viewCount} views.`,
        categoryId: "28",
      },
    },
  });
}

function updateVideoThumbnail(client: youtube_v3.Youtube, videoId: string) {
  const media = {
    mimeType: "image/png",
    body: fs.readFileSync("./output/thumbnail.png"),
  };

  client.thumbnails.set({
    videoId,
    uploadType: "media",
    media,
  });
}

function main() {
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
        updateNumberInThumbnail(svgAsDom, viewCount);
        await saveJsdomAsPNG(svgAsDom);
        updateVideoThumbnail(youtubeClient, VIDEO_ID);
      }
    }
  );
}

if (typeof require !== "undefined" && require.main === module) {
  main();
}
