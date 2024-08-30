import './global.css';
import  { BackgroundImage, BackgroundImageProps } from '@helix/ui';
import { SystemColors } from '@helix/core';


export const metadata = {
  title: 'Helix AI',
  description: '',
};

const backgroundImageProps: BackgroundImageProps = {
  imageUrl: '/images/Background.png',
  altText: 'background',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
