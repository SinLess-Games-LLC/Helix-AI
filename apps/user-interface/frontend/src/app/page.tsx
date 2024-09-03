'use client'
import styles from './page.module.scss'
import { Header, HeaderProps, Page, Setting } from '@helix/ui'
import { useState, useEffect } from 'react'

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
    style: {
      backgroundColor: 'rgba(246, 6, 111, .5)',
    },
    pages: pages,
    settings: settings,
    menuOpen: menuOpen,
    toggleMenu: toggleMenu,
  }

  return (
    <div className={styles.page}>
      <Header {...headerProps} />
      <br />
    </div>
  )
}
