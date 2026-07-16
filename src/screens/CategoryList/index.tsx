import { memo, useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { HomeStackParamList, RootStackParamList } from '../../types/navigation';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../../components/MovieCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import Loading from '../../components/Loading';
import { strings } from '../../constants/strings';

const CategoryMovieItem = memo(function CategoryMovieItem({
  movie,
  onPressMovie,
}: {
  movie: any;
  onPressMovie: (movie: any) => void;
}) {
  const handlePress = useCallback(() => {
    onPressMovie(movie);
  }, [movie, onPressMovie]);

  return <MovieCard movie={movie} onPress={handlePress} fullWidth />;
});

export default function CategoryListScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      NativeStackNavigationProp<HomeStackParamList, 'CategoryList'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const route = useRoute<RouteProp<HomeStackParamList, 'CategoryList'>>();
  const category = route.params.category;
  const { movies, loading, refreshing, refresh, error } = useMovies(20);

  const filteredMovies = useMemo(() => {
    if (!movies?.length) return [];
    if (category === 'All') return movies;
    return movies.filter((movie) => movie.genre.includes(category));
  }, [movies, category]);

  const handleMoviePress = useCallback((movie: any) => {
    navigation.navigate('Details', { movie });
  }, [navigation]);

  const keyExtractor = useCallback((item: any) => item.id, []);
  const renderMovieItem = useCallback(
    ({ item }: { item: any }) => <CategoryMovieItem movie={item} onPressMovie={handleMoviePress} />,
    [handleMoviePress]
  );

  const screenTitle = category === 'All' ? strings.categoryList.allMovies : `${category} ${strings.categoryList.movies}`;

  if (loading && !movies.length) {
    return <Loading variant="list" />;
  }

  if (error) {
    return <ErrorState onRetry={refresh} />;
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <View className="flex-row items-center justify-between px-5 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex-row items-center rounded-full border border-white/10 bg-white/5 px-3 py-2"
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </Pressable>
        <Text className="text-lg font-bold text-white">{screenTitle}</Text>
        <View className="w-16" />
      </View>

      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#fff" />}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        ListEmptyComponent={
          <View className="px-5 pt-12">
            <EmptyState onRetry={refresh} />
          </View>
        }
      />
    </View>
  );
}
