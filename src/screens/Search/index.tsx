import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import type { Movie } from '../../types/movie';
import Header from '../../components/Header';
import useMovies from '../../hooks/useMovies';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { strings } from '../../constants/strings';
import { useTheme } from '../../contexts/ThemeContext';
import FallbackImage from '../../components/FallbackImage';

const SearchMovieItem = memo(function SearchMovieItem({ movie, onPressMovie, isDark }: { movie: Movie; onPressMovie: (movie: Movie) => void; isDark: boolean }) {
  const handlePress = useCallback(() => {
    onPressMovie(movie);
  }, [movie, onPressMovie]);

  return (
    <Pressable
      onPress={handlePress}
      className="rounded-3xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 4,
      }}
    >
      <FallbackImage
        source={{ uri: movie.cover }}
        style={{ width: '100%', height: 180 }}
        contentFit="cover"
      />
      <View className="px-4 py-4">
        <Text className="text-xl font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }} numberOfLines={2}>{movie.title}</Text>
        <Text className="mt-2 text-sm" style={{ color: isDark ? '#94a3b8' : '#475569' }}>{movie.genre.join(' • ')}</Text>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.18)' : '#dbeafe' }}>
            <Text className="text-xs font-semibold" style={{ color: isDark ? '#bfdbfe' : '#1d4ed8' }}>★ {movie.rating}</Text>
          </View>
          <Text className="text-xs font-semibold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{movie.year}</Text>
          <Text className="text-xs font-semibold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{movie.duration}</Text>
        </View>
        <Text className="mt-3 text-sm leading-6" style={{ color: isDark ? '#cbd5e1' : '#475569' }} numberOfLines={3}>{movie.overview}</Text>
      </View>
    </Pressable>
  );
});

const TopPickItem = memo(function TopPickItem({ movie, onPressMovie, isDark }: { movie: Movie; onPressMovie: (movie: Movie) => void; isDark: boolean }) {
  const handlePress = useCallback(() => {
    onPressMovie(movie);
  }, [movie, onPressMovie]);

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: 200,
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 4,
      }}
    >
      <FallbackImage
        source={{ uri: movie.cover }}
        style={{ width: '100%', height: 140 }}
        contentFit="cover"
      />
      <View className="px-4 py-4">
        <Text className="text-base font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }} numberOfLines={2}>{movie.title}</Text>
        <Text className="mt-2 text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{movie.genre.join(' • ')}</Text>
      </View>
    </Pressable>
  );
});

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Details'>>();
  const scrollRef = useRef<FlatList<Movie>>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [])
  );
  const { isDark } = useTheme();
  const { movies, loading, refresh, error } = useMovies();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return movies;
    return movies.filter((item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.genre.join(' ').toLowerCase().includes(normalized)
    );
  }, [movies, query]);

  const handlePress = useCallback((movie: Movie) => {
    navigation.navigate('Details', { movie });
  }, [navigation]);

  const keyExtractor = useCallback((item: Movie) => item.id, []);
  const topPicksKeyExtractor = useCallback((item: Movie) => `top-${item.id}`, []);
  const renderTopPickItem = useCallback(
    ({ item }: { item: Movie }) => <TopPickItem movie={item} onPressMovie={handlePress} isDark={isDark} />,
    [handlePress, isDark]
  );
  const renderSearchItem = useCallback(
    ({ item }: { item: Movie }) => (
      <View className="px-6">
        <SearchMovieItem movie={item} onPressMovie={handlePress} isDark={isDark} />
      </View>
    ),
    [handlePress, isDark]
  );

  const getItemLayout = useCallback((_: ArrayLike<Movie> | null | undefined, index: number) => ({
    length: 340,
    offset: 340 * index + 16 * index,
    index,
  }), []);

  if (loading && !movies.length) {
    return <Loading variant="search" />;
  }

  if (error) {
    return <ErrorState onRetry={refresh} />;
  }

  const header = (
    <View>
      <Header
        title={strings.search.title}
        subtitle={strings.search.subtitle}
        iconName="search"
        textColor={isDark ? '#ffffff' : '#111827'}
        subtitleColor={isDark ? '#9ca3af' : '#6b7280'}
        iconColor={isDark ? '#ff6b6b' : '#ff6b6b'}
      />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={strings.search.placeholder}
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        style={{
          marginHorizontal: 24,
          marginTop: 8,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          paddingHorizontal: 18,
          paddingVertical: 16,
          color: isDark ? '#ffffff' : '#111827',
          fontSize: 16,
          fontWeight: '500',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      />

      <View className="mt-10 flex-row items-center justify-between px-6">
        <Text className="text-2xl font-extrabold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
          {strings.search.results}
        </Text>
        <Text className="text-sm font-semibold" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
          {filtered.length} {strings.search.found}
        </Text>
      </View>

      <View className="mt-6 mb-8 px-6">
        <Text className="mb-4 text-lg font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
          {strings.search.topPicks}
        </Text>
        <View>
          <FlatList
            data={filtered.slice(0, 4)}
            horizontal
            keyExtractor={topPicksKeyExtractor}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={4}
            windowSize={3}
            removeClippedSubviews
            renderItem={renderTopPickItem}
          />
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f5f5f5' }}
      contentContainerStyle={{ paddingBottom: 80 }}
      data={filtered}
      keyExtractor={keyExtractor}
      renderItem={renderSearchItem}
      getItemLayout={getItemLayout}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View className="px-6 pt-8">
          <EmptyState onRetry={refresh} />
        </View>
      }
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews
      onRefresh={refresh}
      refreshing={loading && !movies.length}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  );
}
