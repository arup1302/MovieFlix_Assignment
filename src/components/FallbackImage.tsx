import { useEffect, useState } from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import { Image, type ImageProps } from 'expo-image';

const fallbackImage = require('../../assets/icon.png');

type Props = Omit<ImageProps, 'source'> & {
  source: ImageProps['source'];
  style?: StyleProp<ImageStyle>;
};

function normalizeSource(source: ImageProps['source']): ImageProps['source'] {
  if (!source) return fallbackImage;

  if (typeof source === 'string') {
    return source.trim() ? source : fallbackImage;
  }

  if (typeof source === 'object' && 'uri' in source) {
    return source.uri ? source : fallbackImage;
  }

  return source;
}

export default function FallbackImage({ source, onError, ...rest }: Props) {
  const [resolvedSource, setResolvedSource] = useState<ImageProps['source']>(normalizeSource(source));

  useEffect(() => {
    setResolvedSource(normalizeSource(source));
  }, [source]);

  return (
    <Image
      {...rest}
      source={resolvedSource}
      onError={(event) => {
        setResolvedSource(fallbackImage);
        onError?.(event);
      }}
    />
  );
}