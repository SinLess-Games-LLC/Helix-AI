'use client'
import styles from './page.module.scss'
import { Header, HeaderProps, Page, Setting } from '@helix/ui'
import { useState, useEffect } from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { DiscordColorPalette, HelixColors } from '@helix/core'

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [version, setVersion] = useState<string>('Loading...')

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/app/version')
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.statusText}`)
        }
        const data = await response.json()
        setVersion(data.version)
      } catch (error) {
        console.error('Error fetching version:', error)
        setVersion('Error fetching version')
      }
    }

    fetchVersion()
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const pages: Page[] = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/About' },
    { name: 'Contact', url: '/Contact' },
  ]

  const settings: Setting[] = [
    { name: 'Profile' },
    { name: 'Settings' },
    { name: 'Logout' },
  ]

  const headerProps: HeaderProps = {
    logo_url: '/images/Favicon-01.png',
    title: 'Helix AI',
    version: version,
    backgroundColor: `rgb(${HelixColors.primary.rgb})`,
    pages: pages,
    settings: settings,
    menuOpen: menuOpen,
    toggleMenu: toggleMenu,
  }

  return (
    <Box
      sx={{
        overflow: 'auto',
        minHeight: '100vh',
        maxHeight: '50rem',
        margin: 0,
        scrollbarWidth: '2rem',
      }}
    >
      {/* Header Section */}
      <Header {...headerProps} />
      <br />

      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}>
        {/* Left Column: Google Ads (10% width) */}
        <Box
          sx={{
            width: '10%',
            minHeight: '100vh',
          }}
        >
          {/* Google Ads Placeholder */}
        </Box>

        {/* Middle Column: Main Content (80% width) */}
        <Box
          sx={{
            width: '80%',
            minHeight: '100vh',
            bgcolor: 'white',
            padding: 2,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Hero Section */}
          <Box
            className={styles.heroSection}
            sx={{
              backgroundColor: `rgba(${DiscordColorPalette.gray4.rgb}, 0.5)`,
              color: 'white',
              borderRadius: '4rem',
              border: `.5rem solid ${HelixColors.primary.hex}`,
              contain: 'content',
              padding: '2rem',
            }}
          >
            <Typography
              variant="h4"
              className={styles.heroTitle}
              sx={{
                padding: '1rem',
                fontFamily: "'Pinyon Script', cursive",
                fontWeight: 'bold',
                fontSize: '4rem',
              }}
            >
              Seamless Automation. Powerful Analytics. Effortless Integration.
            </Typography>
            <Typography
              variant="h6"
              className={styles.heroSubtitle}
              sx={{ fontSize: '2rem' }}
            >
              Discover the power of Helix AI in managing your apps with
              AI-driven solutions and seamless integrations.
            </Typography>
            <br />
            <Typography
              variant="body1"
              className={styles.heroText}
              sx={{ padding: '1rem', fontSize: '1.5rem' }}
            >
              Helix AI is your ultimate all-in-one solution for seamless app
              management, making it easier than ever to handle your digital
              ecosystem. Harnessing the power of AI-driven algorithms, Helix AI
              intelligently automates your tasks, streamlining workflows and
              reducing the time you spend on manual processes. Whether
              you&apos;re running a smart home, managing social media, or
              handling business applications, our platform takes care of the
              heavy lifting by optimizing task management based on your unique
              needs. With our robust integration system, effortlessly connect
              and synchronize your favorite apps, services, and tools. Say
              goodbye to juggling multiple platforms — Helix AI brings
              everything together under one unified system, allowing your apps
              to communicate and work in harmony. Plus, Helix AI offers deep,
              real-time insights and actionable metrics across all your
              connected services. From performance analytics to usage
              statistics, we give you the data you need to make informed
              decisions and maximize efficiency.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={styles.ctaButton}
              sx={{ padding: '1rem' }}
            >
              Explore Helix AI!
            </Button>
          </Box>

          {/* Core Features Section */}
          <Container
            className={styles.coreFeaturesSection}
            sx={{ padding: '50px 20px' }}
          >
            <Typography variant="h3" className={styles.sectionTitle}>
              Core Features
            </Typography>
            <Box className={styles.featuresGrid}>
              {/* You will replace these with feature components */}
              <Box className={styles.featureItem}>
                <Typography variant="h5">AI-Driven Solutions</Typography>
                <Typography>
                  Automate tasks intelligently with Helix AI&apos;s tailored
                  algorithms.
                </Typography>
              </Box>
              <Box className={styles.featureItem}>
                <Typography variant="h5">Seamless Integrations</Typography>
                <Typography>
                  Connect apps effortlessly with Helix AI&apos;s robust
                  integration system.
                </Typography>
              </Box>
              <Box className={styles.featureItem}>
                <Typography variant="h5">Powerful Analytics</Typography>
                <Typography>
                  Gain deep insights and actionable metrics across your
                  connected services.
                </Typography>
              </Box>
              {/* Add more feature items as needed */}
            </Box>
          </Container>

          {/* CTA Section */}
          <Box
            className={styles.ctaSection}
            sx={{
              textAlign: 'center',
              padding: '50px 20px',
              backgroundColor: '#f7f7f7',
            }}
          >
            <Typography variant="h4">
              Ready to Harness the Power of Helix AI?
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={styles.ctaButton}
            >
              Sign Up for Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              className={styles.ctaButton}
              sx={{ marginLeft: '15px' }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Right Column: Google Ads (10% width) */}
        <Box
          sx={{
            width: '10%',
            minHeight: '100vh',
            display: { xs: 'none, sm: none, md: flex' },
          }}
        >
          {/* Google Ads Placeholder */}
        </Box>
      </Box>
    </Box>
  )
}
