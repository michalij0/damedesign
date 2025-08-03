// src/components/SafeImage.tsx
import NextImage, { type ImageProps } from 'next/image';

// Definiujemy propsy dla naszego komponentu, które są takie same jak dla <Image>
type SafeImageProps = ImageProps;

const SafeImage = (props: SafeImageProps) => {
  const { src, alt, ...rest } = props;

  // Sprawdzamy, czy `src` istnieje. Jeśli nie, używamy placeholdera.
  const imageSrc = src || '/img/placeholder.png';
  
  // Domyślny tekst alternatywny, jeśli nie został podany
  const imageAlt = alt || 'Domyślny obrazek zastępczy';

  return (
    <NextImage
      src={imageSrc}
      alt={imageAlt}
      {...rest}
      // Dodajemy obsługę błędu, na wypadek gdyby podany link był uszkodzony
      onError={(e) => {
        // W przypadku błędu ładowania, zamień źródło na placeholder
        (e.target as HTMLImageElement).src = '/img/placeholder.png';
      }}
    />
  );
};

export default SafeImage;