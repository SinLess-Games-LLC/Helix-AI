import {
  DiscordStatusSummaryUrl,
  DiscordStatusUrl,
  CloudflareStatusSummaryUrl,
  CloudflareStatusUrl,
  HelixColors,
} from './constants'

describe('Constants Module', () => {
  describe('Discord Status URLs', () => {
    it('should have the correct DiscordStatusSummaryUrl', () => {
      expect(DiscordStatusSummaryUrl).toBe(
        'https://discordstatus.com/api/v2/summary.json',
      )
    })

    it('should have the correct DiscordStatusUrl', () => {
      expect(DiscordStatusUrl).toBe(
        'https://discordstatus.com/api/v2/status.json',
      )
    })
  })

  describe('Cloudflare Status URLs', () => {
    it('should have the correct CloudflareStatusSummaryUrl', () => {
      expect(CloudflareStatusSummaryUrl).toBe(
        'https://www.cloudflarestatus.com/api/v2/summary.json',
      )
    })

    it('should have the correct CloudflareStatusUrl', () => {
      expect(CloudflareStatusUrl).toBe(
        'https://www.cloudflarestatus.com/api/v2/status.json',
      )
    })
  })

  describe('HelixColors', () => {
    it('should have the correct primary color', () => {
      expect(HelixColors.primary.hex).toBe('F7068D')
      expect(HelixColors.primary.rgb).toBe('rgb(247,6,141')
    })

    it('should have the correct secondary color', () => {
      expect(HelixColors.secondary.hex).toBe('1540D1')
      expect(HelixColors.secondary.rgb).toBe('rgb(21,64,209)')
    })

    it('should have the correct tertiary color', () => {
      expect(HelixColors.tertiary.hex).toBe('3D3D3D')
      expect(HelixColors.tertiary.rgb).toBe('rgb(61,61,61)')
    })

    it('should have the correct success color', () => {
      expect(HelixColors.success.hex).toBe('#28a745')
      expect(HelixColors.success.rgb).toBe('rgb(40,167,69)')
    })

    it('should have the correct error color', () => {
      expect(HelixColors.error.hex).toBe('#FF4C4C')
      expect(HelixColors.error.rgb).toBe('rgb(255,76,76)')
    })

    it('should have the correct warning color', () => {
      expect(HelixColors.warning.hex).toBe('#FFA500')
      expect(HelixColors.warning.rgb).toBe('rgb(255,165,0)')
    })

    it('should have the correct info color', () => {
      expect(HelixColors.info.hex).toBe('#1E90FF')
      expect(HelixColors.info.rgb).toBe('rgb(30,144,255)')
    })
  })
})
