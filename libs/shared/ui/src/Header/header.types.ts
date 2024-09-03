export interface Page {
  name: string
  url: string
}

export interface Setting {
  name: string
  url?: string
  action?: () => void
}

export interface HeaderProps {
  logo_url: string
  title: string
  version: string
  style: React.CSSProperties
  pages: Page[]
  settings: Setting[]
  menuOpen: boolean
  toggleMenu: () => void
}
