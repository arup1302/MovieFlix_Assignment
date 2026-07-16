import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, SectionList, Text, View } from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useMovies from '../../hooks/useMovies';
import Loading from '../../components/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import type { Movie } from '../../types/movie';
import { HomeStackParamList, RootStackParamList } from '../../types/navigation';
import { strings } from '../../constants/strings';
import CategoryRow from '../../components/CategoryRow';
import FallbackImage from '../../components/FallbackImage';

type HomeSection = {
  key: string;
  kind: 'hero' | 'categories' | 'top' | 'continue' | 'genre';
  data: string[];
  title?: string;
  movies?: Movie[];
};

export default function HomeScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      NativeStackNavigationProp<HomeStackParamList, 'Home'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const sectionListRef = useRef<SectionList<string, HomeSection>>(null);

  useFocusEffect(
    useCallback(() => {
      sectionListRef.current?.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewOffset: 0 });
    }, [])
  );
  const { isDark } = useTheme();
  const { movies, loading, error, refreshing, refresh, loadMore, hasMore, loadingMore } = useMovies(20);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const pageBackground = isDark ? '#0f172a' : '#f8fafc';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const chipActiveBg = isDark ? 'rgba(59,130,246,0.18)' : '#dbeafe';
  const chipInactiveBg = isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc';
  const cardDarkBg = isDark ? '#111827' : '#ffffff';

  const continueWatching = useMemo(() => {
    return movies.slice(1, 5).map((movie, index) => ({
      movie,
      progress: Math.min(90, 30 + index * 15),
    }));
  }, [movies]);

  const categories = useMemo(() => {
    if (!movies?.length) return ['All'];
    const genreSet = new Set<string>();
    movies.forEach((movie) => movie.genre.forEach((genre) => genreSet.add(genre)));
    return ['All', ...Array.from(genreSet)];
  }, [movies]);

  const selectedCategoryMovies = useMemo(() => {
    if (!movies) return [];
    const filtered = selectedCategory === 'All'
      ? movies
      : movies.filter((movie) => movie.genre.includes(selectedCategory));
    return filtered.slice(0, 8);
  }, [movies, selectedCategory]);

  const genreSections = useMemo<HomeSection[]>(() => {
    return categories
      .filter((category) => category !== 'All')
      .map((category) => ({
        key: `genre-${category.toLowerCase().replace(/\s+/g, '-')}`,
        kind: 'genre' as const,
        data: [category],
        title: `${category} ${strings.home.moviesSuffix}`,
        movies: movies.filter((movie) => movie.genre.includes(category)).slice(0, 6),
      }))
      .filter((section) => (section.movies?.length ?? 0) > 0);
  }, [categories, movies]);

  const hero = useMemo(() => (movies && movies.length > 0 ? movies[0] : null), [movies]);

  const sections = useMemo<HomeSection[]>(() => ([
    { key: 'hero', kind: 'hero' as const, data: ['hero'] },
    { key: 'categories', kind: 'categories' as const, data: ['categories'] },
    { key: 'top', kind: 'top' as const, data: ['top'] },
    { key: 'continue', kind: 'continue' as const, data: ['continue'] },
    ...genreSections,
  ]), [genreSections]);

  const handleMoviePress = useCallback((movie: Movie) => {
    navigation.navigate('Details', { movie });
  }, [navigation]);

  const renderHero = () => (
    <View className="px-6 pt-6">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-black" style={{ color: textColor }}>{strings.home.brand}</Text>
          <Text className="mt-1 text-sm" style={{ color: mutedText }}>{strings.home.subtitle}</Text>
        </View>
        <View style={{ borderRadius: 999, borderWidth: 1, borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.2)', backgroundColor: isDark ? 'rgba(59,130,246,0.12)' : '#e0f2fe', paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text className="text-xs font-semibold" style={{ color: isDark ? '#bfdbfe' : '#1d4ed8' }}>{strings.home.premium}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: cardDarkBg, borderColor: cardBorder }} className="overflow-hidden rounded-[28px] border">
        {hero ? (
          <Pressable onPress={() => handleMoviePress(hero)}>
            <FallbackImage source={hero.cover} style={{ width: '100%', height: 240 }} contentFit="cover" />
            <View className="absolute inset-0" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.1)' }} />
            <View className="absolute bottom-0 left-0 right-0 p-6">
              <Text className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: isDark ? '#93c5fd' : '#2563eb' }}>{strings.home.featured}</Text>
              <Text className="mt-2 text-3xl font-black" style={{ color: textColor }}>{hero.title}</Text>
              <Text className="mt-2 text-sm" style={{ color: mutedText }}>{hero.genre.slice(0, 2).join(' • ')} • {hero.year}</Text>
            </View>
          </Pressable>
        ) : (
          <View className="h-56 items-center justify-center">
            <Text style={{ color: mutedText }}>{strings.home.noFeatured}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View className="mt-6 px-6">
      <Text className="mb-3 text-base font-medium" style={{ color: mutedText }}>{strings.home.categories}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 5, paddingVertical: 5 }}>
        {categories.map((label) => (
          <Pressable
            key={label}
            onPress={() => setSelectedCategory(label)}
            style={{
              marginRight: 12,
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: selectedCategory === label ? chipActiveBg : chipInactiveBg,
            }}>
            <Text style={{ color: selectedCategory === label ? (isDark ? '#dbeafe' : '#1d4ed8') : (isDark ? '#cbd5e1' : '#64748b'), fontSize: 14, fontWeight: '600' }}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderTopRow = () => (
    <View className="mt-4 px-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-bold" style={{ color: textColor }}>{strings.home.topIn} {selectedCategory}</Text>
        <Pressable onPress={() => navigation.navigate('CategoryList', { category: selectedCategory })}>
          <Text className="text-sm font-medium" style={{ color: isDark ? '#93c5fd' : '#2563eb' }}>{strings.home.more}</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
        {selectedCategoryMovies.length ? selectedCategoryMovies.map((item, index) => (
          <Pressable
            key={`category-${item.id}-${index}`}
            onPress={() => handleMoviePress(item)}
            className="mr-4 w-44 overflow-hidden rounded-3xl border"
            style={{ borderColor: cardBorder, backgroundColor: cardDarkBg }}
          >
            <FallbackImage source={item.cover} style={{ width: 176, height: 232 }} contentFit="cover" />
            <View className="px-3 py-3">
              <Text className="text-sm font-semibold" style={{ color: textColor }} numberOfLines={2}>{item.title}</Text>
              <Text className="mt-1 text-xs" style={{ color: mutedText }}>{item.year}</Text>
            </View>
          </Pressable>
        )) : (
          <View className="mr-4 w-44 overflow-hidden rounded-3xl border p-4" style={{ borderColor: cardBorder, backgroundColor: cardDarkBg }}>
            <Text className="text-sm font-semibold" style={{ color: textColor }}>{strings.home.noMoviesFound}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderContinueWatching = () => {
    if (!continueWatching.length) return null;

    return (
      <View className="mt-6 px-6">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-semibold" style={{ color: textColor }}>{strings.home.continueWatching}</Text>
          <Text className="text-sm font-medium" style={{ color: mutedText }}>{strings.home.keepWatching}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
          {continueWatching.map(({ movie, progress }) => (
            <Pressable
              key={`continue-${movie.id}`}
              onPress={() => handleMoviePress(movie)}
              className="mr-4 w-56 overflow-hidden rounded-3xl border"
              style={{ borderColor: cardBorder, backgroundColor: cardDarkBg }}
            >
              <FallbackImage source={movie.cover} style={{ width: 224, height: 140 }} contentFit="cover" />
              <View className="px-4 py-4">
                <Text className="text-base font-semibold" style={{ color: textColor }} numberOfLines={2}>{movie.title}</Text>
                <View className="mt-3 h-2 rounded-full" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb' }}>
                  <View className="h-2 rounded-full bg-red-500" style={{ width: `${progress}%` }} />
                </View>
                <Text className="mt-2 text-xs" style={{ color: mutedText }}>{progress}% {strings.home.completeSuffix}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderGenreSection = (section: HomeSection) => {
    if (!section.movies?.length) return null;

    return (
      <CategoryRow
        title={section.title ?? ''}
        data={section.movies}
        onSelect={handleMoviePress}
      />
    );
  };

  const renderFooter = () => (
    <>
      {error ? (
        <View className="mx-6 mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <Text className="text-sm font-medium text-red-300">{error}</Text>
        </View>
      ) : null}

      {loadingMore ? (
        <View className="mt-4 items-center py-3">
          <ActivityIndicator size="small" color="#60a5fa" />
        </View>
      ) : null}
    </>
  );

  if (loading && !movies.length) {
    return <Loading variant="home" />;
  }

  return (
    <SectionList
      ref={sectionListRef}
      style={{ backgroundColor: pageBackground }}
      contentContainerStyle={{ paddingBottom: 120 }}
      sections={sections}
      keyExtractor={(item, index) => `${item}-${index}`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={isDark ? '#fff' : '#0f172a'} />}
      onEndReached={() => {
        if (hasMore && !loadingMore) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.6}
      stickySectionHeadersEnabled={false}
      initialNumToRender={4}
      windowSize={7}
      removeClippedSubviews
      ListHeaderComponent={renderHero}
      ListFooterComponent={renderFooter}
      renderItem={({ section }) => {
        switch (section.kind) {
          case 'hero':
            return null;
          case 'categories':
            return renderCategories();
          case 'top':
            return renderTopRow();
          case 'continue':
            return renderContinueWatching();
          case 'genre':
            return renderGenreSection(section);
          default:
            return null;
        }
      }}
    />
  );
}
