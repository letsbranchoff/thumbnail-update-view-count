<h1 align="center">Match View Count in Thumbnail</h1>

This tool updates a videos thumbnail and title to match the view count of the video.
<img width="1099" alt="YouTube channel page showcasing Thumbnail and Title matching view count" src="https://github.com/user-attachments/assets/eb2dcce7-e8bd-46f7-a850-9982e4a32697">


# How do I use this?

You need the following:

- Node.JS
- An SVG template of your thumbnail.
- Google OAuth2 refresh token.

## SVG Thumbnail Template

For the thumbnail I recommend creating your entire thumbnail except for the counter text as save this as a `.png`. Afterwards using an SVG editing tool embed the PNG image and add your view counter text.

Once done you'll need to open the SVG template in a text editor, find your view count text element and update the `id` to `viewCount`.
<img width="411" alt="Screenshot 2024-07-12 at 08 10 10" src="https://github.com/user-attachments/assets/8d10468b-aa1f-4e5f-9e1c-a920dbdb0014">

🗂️ The final SVG image should be placed in the `assets` folder and named `thumbnail-template.svg`.

## Getting a Google OAuth2 Refresh Token

### Pre-requisite: Creating `OAuth client ID`
Before you can get a refresh token you'll need to create OAuth client ID credentials.

1. Create a project in Google Cloud.

> [!IMPORTANT]
> You may need to create an `OAuth Consent Screen` before proceeding.
> - Use `Testing` as the `Publishing Status` and and add your email to `Test Users`.

2. Navigate to `APIs & Services > Credentials`.
3. Choose `Create Credentials > OAuth client ID`.
4. Set the following settings:
   - ```
     Application type         = web application
     Authorized redirect URIs = https://developers.google.com/oauthplayground
     ```
5. Press `Create` and make a note of the `Client ID` and `Client Secret`.

### Creating Refresh Token

Once you've made your credentials and have the client details you can generate the refresh token.

1. Navigate to [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground).
2. In the top-right click the cog.
3. Check `Use your own OAuth credentials`.
   - <img width="478" alt="Screenshot 2024-07-12 at 08 28 44" src="https://github.com/user-attachments/assets/b23128de-2813-46d6-a314-e83027462d7d">
4. Paste your client details and `Close` the menu.
5. On the left-hand side
