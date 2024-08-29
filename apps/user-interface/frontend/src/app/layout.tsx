import './global.css';
import  { BackgroundImage, BackgroundImageProps } from '@helix/ui';
import { SystemColors } from "@helix/core"
import chalk from 'chalk';


export const metadata = {
  title: 'Helix AI',
  description: '',
};

const backgroundImageProps: BackgroundImageProps = {
  imageUrl: '/aimages/background.jpg',
  altText: 'background',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colors = SystemColors
  return (
    <html lang="en">
      <body>
        <BackgroundImage {...backgroundImageProps}>
          {children}
        </BackgroundImage>
      </body>
    </html>
  );
}
