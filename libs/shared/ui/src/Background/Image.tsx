import React from 'react'

export interface BackgroundImageProps {
  imageUrl: string
  altText: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  imageUrl,
  altText,
  style,
  children,
}) => {
  return (
    <div
      style={{
        position: 'static',
        minHeight: '100vh',
        minWidth: '100vw',
        ...style,
      }}
    >
      <div
        aria-label={altText}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />
      {children}
    </div>
  )
}

export default BackgroundImage
