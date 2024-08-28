import { colors, BotColors } from './colors'

describe('Colors Module', () => {
  describe('Terminal Colors', () => {
    it('should contain proper reset and format codes', () => {
      expect(colors.reset).toBe('\x1b[0m')
      expect(colors.bright).toBe('\x1b[1m')
      expect(colors.dim).toBe('\x1b[2m')
      expect(colors.underscore).toBe('\x1b[4m')
      expect(colors.blink).toBe('\x1b[5m')
      expect(colors.reverse).toBe('\x1b[7m')
      expect(colors.hidden).toBe('\x1b[8m')
    })

    it('should contain proper foreground color codes', () => {
      expect(colors.fg.black).toBe('\x1b[30m')
      expect(colors.fg.red).toBe('\x1b[31m')
      expect(colors.fg.green).toBe('\x1b[32m')
      expect(colors.fg.yellow).toBe('\x1b[33m')
      expect(colors.fg.blue).toBe('\x1b[34m')
      expect(colors.fg.magenta).toBe('\x1b[35m')
      expect(colors.fg.cyan).toBe('\x1b[36m')
      expect(colors.fg.white).toBe('\x1b[37m')
      expect(colors.fg.gray).toBe('\x1b[90m')
      expect(colors.fg.crimson).toBe('\x1b[38m')
    })

    it('should contain proper background color codes', () => {
      expect(colors.bg.black).toBe('\x1b[40m')
      expect(colors.bg.red).toBe('\x1b[41m')
      expect(colors.bg.green).toBe('\x1b[42m')
      expect(colors.bg.yellow).toBe('\x1b[43m')
      expect(colors.bg.blue).toBe('\x1b[44m')
      expect(colors.bg.magenta).toBe('\x1b[45m')
      expect(colors.bg.cyan).toBe('\x1b[46m')
      expect(colors.bg.white).toBe('\x1b[47m')
      expect(colors.bg.gray).toBe('\x1b[100m')
      expect(colors.bg.crimson).toBe('\x1b[48m')
    })
  })

  describe('BotColors', () => {
    it('should contain proper bot colors', () => {
      expect(BotColors.bot.blue).toBe('#022371')
      expect(BotColors.bot.pink).toBe('#f6066f')
    })

    it('should contain proper company colors', () => {
      expect(BotColors.company.gold).toBe('#daa520')
      expect(BotColors.company.silver).toBe('#d1cfd0')
      expect(BotColors.company.black).toBe('#000000')
    })

    it('should contain proper system colors', () => {
      expect(BotColors.system.critical).toBe('#FF0000')
      expect(BotColors.system.error).toBe('#EE4B2B')
      expect(BotColors.system.warning).toBe('#FFEA00')
      expect(BotColors.system.info).toBe('#0000FF')
      expect(BotColors.system.success).toBe('#00ff00')
    })
  })
})
