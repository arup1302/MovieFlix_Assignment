import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Movie } from '../../types/movie';
import { useTheme } from '../../contexts/ThemeContext';
import FallbackImage from '../FallbackImage';

type HeroBannerProps = {
  movie: Movie;
  onPress: () => void;
  onDetailsPress: () => void;
};

export default function HeroBanner({ movie, onPress, onDetailsPress }: HeroBannerProps) {
  const { isDark } = useTheme();
  const titleColor = isDark ? '#ffffff' : '#111827';
  const subtitleColor = isDark ? '#e5e7eb' : '#374151';

  return (
    <View className="mx-6 mb-10 overflow-hidden rounded-3xl" style={{
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8
    }}>
      <FallbackImage source={movie.banner || movie.cover} className="h-96 w-full" contentFit="cover" />
      <View className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
        <Text className="text-4xl font-bold" style={{ color: titleColor }} numberOfLines={2}>{movie.title}</Text>
        <Text className="mt-3 text-sm font-medium text-gray-300">{movie.genre.join(' • ')} • {movie.year}</Text>
        <View className="mt-8 flex-row items-center gap-3">
          <Pressable
            onPress={onPress}
            className="flex-1 flex-row items-center justify-center rounded-xl bg-white px-5 py-3.5"
          >
            <MaterialIcons name="play-arrow" size={22} color="#000" />
            <Text className="ml-2 font-bold text-black text-base">Play</Text>
          </Pressable>
          <Pressable
            onPress={onDetailsPress}
            className="flex-row items-center rounded-xl border-2 border-white/40 bg-white/10 px-5 py-3.5"
          >
            <MaterialIcons name="info" size={22} color="white" />
            <Text className="ml-2 font-semibold text-white text-base">Info</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
