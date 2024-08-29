export interface Page {
  name: string;
  url: string;
}

export interface PageList {
  pages: Page[];
}

export interface HeaderProps {
  logo: string; // URL or path to the logo image
  title: string;
  version: string;
  pages: Page[];
  style?: React.CSSProperties; // Optional custom styling
}
