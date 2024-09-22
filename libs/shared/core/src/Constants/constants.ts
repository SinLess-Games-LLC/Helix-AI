//
// Description: This file contains all the constants used in the application.
//

/**
 * @name StatusUrls
 *
 * @description This object contains the URLs for the status pages of Discord and Cloudflare.
 *
 * @property discord - The URLs for the Discord status pages.
 * @property discord.summary - The URL for the Discord status summary.
 * @property discord.status - The URL for the Discord status.
 * @property cloudflare - The URLs for the Cloudflare status pages.
 * @property cloudflare.summary - The URL for the Cloudflare status summary.
 * @property cloudflare.status - The URL for the Cloudflare status.
 */
export const StatusUrls = {
  discord: {
    summary: 'https://discordstatus.com/api/v2/summary.json',
    status: 'https://discordstatus.com/api/v2/status.json',
  },
  cloudflare: {
    summary: 'https://www.cloudflarestatus.com/api/v2/summary.json',
    status: 'https://www.cloudflarestatus.com/api/v2/status.json',
  },
}

export const Openai = {
  api_key: process.env.OPENAI_API_KEY,
  orgId: 'org-wlCKckgkuIxvlsdhXmzeWzkS',
  projectId: "proj_SPeb8ul5y6WNrRw0Ri7SJE0h",
  completions_url: 'https://api.openai.com/v1/chat/completions',
  embeddingsUrl: 'https://api.openai.com/v1/embeddings',
  models:{
    gpt4o: "gpt-4-o",
    gpt4oMini: "gpt-4-mini",
    gpt35Turbo: "gpt-3.5-turbo",
    dalle: 'DALL·E',
    whisper: 'Whisper',
    moderation: 'Moderation',
    embedings: 'text-embedding-ada-002'
  }
}

/**
 * @name HelixColors
 *
 * @description This object contains the primary, secondary, tertiary, success, error, warning, and info colors used in the application.
 *
 * @property primary - The primary color of the application.
 * @property secondary - The secondary color of the application.
 * @property tertiary - The tertiary color of the application.
 * @property success - The success color of the application.
 * @property error - The error color of the application.
 * @property warning - The warning color of the application.
 * @property info - The info color of the application.
 */
export const HelixColors = {
  primary: {
    hex: '#F7068D',
    rgb: '247,6,141',
  },
  secondary: {
    hex: '#1540D1',
    rgb: '21,64,209',
  },
  tertiary: {
    hex: '#3D3D3D',
    rgb: '61,61,61',
  },
  success: {
    hex: '#28a745',
    rgb: '40,167,69',
  },
  error: {
    hex: '#FF4C4C',
    rgb: '255,76,76',
  },
  warning: {
    hex: '#FFA500',
    rgb: '255,165,0',
  },
  info: {
    hex: '#1E90FF',
    rgb: '30,144,255',
  },
}

/**
 * @name DiscordColorPalette
 *
 * @description This object contains the blue, gray1, gray2, gray3, and gray4 colors used in the Discord color palette.
 *
 * @property blue - The blue color of the Discord color palette.
 * @property blue.hex - The hex value of the blue color.
 * @property blue.rgb - The RGB value of the blue color.
 * @property gray1 - The gray1 color of the Discord color palette.
 * @property gray1.hex - The hex value of the gray1 color.
 * @property gray1.rgb - The RGB value of the gray1 color.
 * @property gray2 - The gray2 color of the Discord color palette.
 * @property gray2.hex - The hex value of the gray2 color.
 * @property gray2.rgb - The RGB value of the gray2 color.
 * @property gray3 - The gray3 color of the Discord color palette.
 * @property gray3.hex - The hex value of the gray3 color.
 * @property gray3.rgb - The RGB value of the gray3 color.
 * @property gray4 - The gray4 color of the Discord color palette.
 * @property gray4.hex - The hex value of the gray4 color.
 * @property gray4.rgb - The RGB value of the gray4 color.
 */
export const DiscordColorPalette = {
  blue: {
    hex: '#7289da',
    rgb: '114,137,218',
  },
  gray1: {
    hex: '#424549',
    rgb: '66,69,73',
  },
  gray2: {
    hex: '#36393e',
    rgb: '54,57,62',
  },
  gray3: {
    hex: '#282b30',
    rgb: '40,43,48',
  },
  gray4: {
    hex: '#1e2124',
    rgb: '30,33,36',
  },
}
