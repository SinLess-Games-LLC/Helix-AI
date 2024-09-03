'use client'
import { createTheme } from '@mui/material/styles'
import { Pinyon_Script, Roboto } from 'next/font/google'
import { HelixColors } from '@helix/core'

const PinyonScript = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  style: 'normal',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  style: 'normal',
})

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: roboto.style.fontFamily,
    h6: {
      fontFamily: PinyonScript.style.fontFamily,
    },
    h5: {
      fontFamily: PinyonScript.style.fontFamily,
    },
  },
  palette: {
    primary: {
      main: `rgba(${HelixColors.primary.rgb}, .5)`,
    },
    secondary: {
      main: HelixColors.secondary.hex,
    },
  },
})

export default theme
