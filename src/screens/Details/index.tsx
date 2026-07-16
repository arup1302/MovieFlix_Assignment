import { useMemo, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { strings } from '../../constants/strings';
import { joinGenres } from '../../utils/format';
import { useTheme } from '../../contexts/ThemeContext';
import FallbackImage from '../../components/FallbackImage';

export default function DetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Details'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const { isDark } = useTheme();
  const { movie } = route.params;

  const metadata = useMemo(
    () => [movie.year, movie.duration, movie.rating].filter(Boolean).join(' • '),
    [movie.duration, movie.rating, movie.year]
  );

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 500 });
  }, [progress]);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedTextColor = isDark ? '#9ca3af' : '#6b7280';
  const cardBackground = isDark ? '#1f2937' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const chipBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';
  const chipBorder = isDark ? '#3f3f46' : '#e5e7eb';

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="relative h-96" style={{ backgroundColor: isDark ? '#1f2937' : '#e5e7eb' }}>
          <Animated.View style={imageStyle} className="h-full w-full">
            <FallbackImage source={movie.cover} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </Animated.View>
          <View className="absolute inset-x-0 top-0 flex-row items-center justify-between px-6 py-8">
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              className="rounded-full p-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <MaterialIcons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="rounded-full p-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <MaterialIcons name="favorite-border" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-t-3xl px-6 py-8 -mt-8" style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
          <View className="flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-4xl font-bold" style={{ color: textColor }} numberOfLines={3}>{movie.title}</Text>
            <View className="rounded-full border px-4 py-2" style={{ borderColor: chipBorder, backgroundColor: chipBackground, marginTop: 2 }}>
              <Text className="text-base font-bold text-yellow-400">★ {movie.rating}</Text>
            </View>
          </View>

          <Text className="mt-4 text-sm font-medium" style={{ color: mutedTextColor }}>{metadata}</Text>
          
          <View className="mt-6 flex-row flex-wrap gap-3">
            <View className="rounded-full border px-4 py-2" style={{ borderColor: chipBorder, backgroundColor: chipBackground }}>
              <Text className="text-sm font-semibold" style={{ color: textColor }}>{joinGenres(movie.genre)}</Text>
            </View>
            <View className="rounded-full border px-4 py-2" style={{ borderColor: chipBorder, backgroundColor: chipBackground }}>
              <Text className="text-sm font-semibold" style={{ color: textColor }}>🕐 {strings.details.runtime}: {movie.runtime}</Text>
            </View>
          </View>

          <View className="mt-8 rounded-2xl border-2 p-6" style={{ borderColor: chipBorder, backgroundColor: isDark ? '#09090b' : '#f9fafb' }}>
            <Text className="text-lg font-bold" style={{ color: textColor }}>{strings.details.storyline}</Text>
            <Text className="mt-4 text-base leading-7" style={{ color: mutedTextColor }}>{movie.overview}</Text>
          </View>

          <View className="mt-6 rounded-2xl border-2 p-6" style={{ borderColor: chipBorder, backgroundColor: isDark ? '#09090b' : '#f9fafb' }}>
            <Text className="text-lg font-bold" style={{ color: textColor }}>🎬 {strings.details.director}</Text>
            <Text className="mt-3 text-base font-semibold" style={{ color: textColor }}>{movie.director}</Text>
          </View>

          <View className="mt-6 rounded-2xl border-2 p-6" style={{ borderColor: chipBorder, backgroundColor: isDark ? '#09090b' : '#f9fafb' }}>
            <Text className="text-lg font-bold" style={{ color: textColor }}>👥 {strings.details.cast}</Text>
            <Text className="mt-3 text-base leading-7 font-semibold" style={{ color: textColor }}>{movie.cast.join(', ')}</Text>
          </View>

          <View className="mt-8">
            <Text className="mb-4 text-2xl font-bold" style={{ color: textColor }}>{strings.details.moreLikeThis}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
              {movie.related.map((item) => (
                <View 
                  key={item.id} 
                  className="mr-4 h-56 w-40 overflow-hidden rounded-2xl" 
                  style={{ 
                    backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  }}
                >
                  <FallbackImage source={item.cover} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
