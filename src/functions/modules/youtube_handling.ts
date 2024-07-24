import { google, youtube_v3 } from "googleapis";

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
    description: snippet.description
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
  viewCount: number,
  description: string
) {
  client.videos.update({
    part: ["snippet"],
    requestBody: {
      id: videoId,
      snippet: {
        title: `This video has ${viewCount} views.`,
        categoryId: "28",
        description
      },
    },
  });
}

function updateVideoThumbnail(
  client: youtube_v3.Youtube,
  videoId: string,
  thumbnail: Buffer
) {
  const media = {
    mimeType: "image/png",
    body: thumbnail,
  };

  client.thumbnails.set({
    videoId,
    uploadType: "media",
    media,
  });
}

export {
  getGoogleOAuthClient,
  getYoutubeClient,
  fetchVideoDetails,
  parsePreviousViewsFromTitle,
  updateVideoTitle,
  updateVideoThumbnail,
};
