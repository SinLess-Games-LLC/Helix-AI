import './global.scss'
import { BackgroundImage, BackgroundImageProps } from '@helix/ui'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { SystemColors } from '@helix/core'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { Box } from '@mui/material'

export const metadata = {
  title: 'Helix AI',
  description: '',
}

const backgroundImageProps: BackgroundImageProps = {
  imageUrl: '/images/Background.png',
  altText: 'background',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const color = SystemColors.reset

  console.log(color)
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9610840170359196" />
      </head>
      <body>
        <Box>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider theme={theme}>
              <BackgroundImage {...backgroundImageProps}>
                <br />
                <br />
                {children}
              </BackgroundImage>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Box>
      </body>
    </html>
  )
}
