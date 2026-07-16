import { FlatList, Text, View } from 'react-native';
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';
import { useTheme } from '../../contexts/ThemeContext';

type Props = {
  title: string;
  data: Movie[];
  onSelect: (movie: Movie) => void;
  loading?: boolean;
};

export default function CategoryRow({ title, data, onSelect, loading }: Props) {
  const { isDark } = useTheme();
  const titleColor = isDark ? '#ffffff' : '#111827';
  const skeletonColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <View className="mb-10 px-4">
      <Text className="mt-2 mb-5 text-2xl font-bold tracking-tight" style={{ color: titleColor }}>{title}</Text>
      {loading ? (
        <View className="flex-row gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <View 
              key={index} 
              className="rounded-3xl" 
              style={{ 
                width: 224,
                height: 256,
                backgroundColor: skeletonColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 2
              }} 
            />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          renderItem={({ item }) => <MovieCard movie={item} onPress={() => onSelect(item)} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={4}
          windowSize={5}
          removeClippedSubviews
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
}
