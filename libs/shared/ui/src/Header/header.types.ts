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
  backgroundColor: string
  pages: Page[]
  settings: Setting[]
  menuOpen: boolean
  toggleMenu: () => void
}
