// src/components/SafeImage.tsx
import NextImage, { type ImageProps } from 'next/image';


type SafeImageProps = ImageProps;

const SafeImage = (props: SafeImageProps) => {
  const { src, alt, ...rest } = props;

  const imageSrc = src || '/img/placeholder.png';
  
  const imageAlt = alt || 'Domyślny obrazek zastępczy';

  return (
    <NextImage
      src={imageSrc}
      alt={imageAlt}
      {...rest}

      onError={(e) => {

        (e.target as HTMLImageElement).src = '/img/placeholder.png';
      }}
    />
  );
};

export default SafeImage;