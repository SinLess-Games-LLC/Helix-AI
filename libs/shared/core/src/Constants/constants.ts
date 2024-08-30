//
// Description: This file contains all the constants used in the application.
//

// Discord Status API URL
export const DiscordStatusSummaryUrl =
  'https://discordstatus.com/api/v2/summary.json'
export const DiscordStatusUrl = 'https://discordstatus.com/api/v2/status.json'

// Cloudflare Status API URL
export const CloudflareStatusSummaryUrl =
  'https://www.cloudflarestatus.com/api/v2/summary.json'
export const CloudflareStatusUrl =
  'https://www.cloudflarestatus.com/api/v2/status.json'

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
    rgb: 'rgb(247,6,141',
  },
  secondary: {
    hes: '1540D1',
    rgb: 'rgb(21,64,209)',
  },
  tertiary: {
    hex: '#3D3D3D',
    rgb: 'rgb(61,61,61)',
  },
  success: {
    hex: '#28a745',
    rgb: 'rgb(40,167,69)',
  },
  error: {
    hex: '#FF4C4C',
    rgb: 'rgb(255,76,76)',
  },
  warning: {
    hex: '#FFA500',
    rgb: 'rgb(255,165,0)',
  },
  info: {
    hex: '#1E90FF',
    rgb: 'rgb(30,144,255)',
  },
}
