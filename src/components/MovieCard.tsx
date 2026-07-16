import { memo, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import type { Movie } from "../types/movie";
import FallbackImage from "./FallbackImage";

type Props = {
  movie: Movie;
  onPress: () => void;
  fullWidth?: boolean;
};

function MovieCard({ movie, onPress, fullWidth = false }: Props) {
  const { isDark } = useTheme();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 400 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: (1 - progress.value) * 20,
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={{
          marginHorizontal: fullWidth ? 0 : 16,
          marginVertical: 10,
          width: fullWidth ? '100%' : 224,
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: isDark ? "#111827" : "#ffffff",

          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },

          elevation: 6,
        }}
      >
        <FallbackImage
          source={movie.cover}
          style={{
            width: fullWidth ? '100%' : 224,
            height: fullWidth ? 180 : 140,
          }}
          contentFit="cover"
        />

        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text
            style={{
              color: isDark ? "#fff" : "#111",
              fontSize: fullWidth ? 20 : 16,
              fontWeight: "700",
            }}
            numberOfLines={fullWidth ? 2 : 2}
          >
            {movie.title}
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: fullWidth ? 14 : 12,
            }}
            numberOfLines={fullWidth ? 2 : 1}
          >
            {movie.genre.join(" • ")}
          </Text>

          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: isDark ? "rgba(59,130,246,0.18)" : "#E8F8EC",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 30,
              }}
            >
              <Text
                style={{
                  color: isDark ? "#bfdbfe" : "#0A8A36",
                  fontWeight: "700",
                  fontSize: fullWidth ? 13 : 12,
                }}
              >
                ⭐ {movie.rating}
              </Text>
            </View>

            <Text
              style={{
                color: isDark ? "#94a3b8" : "#6b7280",
                fontWeight: "600",
                fontSize: fullWidth ? 13 : 12,
              }}
            >
              {movie.year}
            </Text>
          </View>

          {fullWidth ? (
            <Text
              style={{
                marginTop: 10,
                color: isDark ? '#cbd5e1' : '#475569',
                fontSize: 14,
                lineHeight: 22,
              }}
              numberOfLines={3}
            >
              {movie.overview}
            </Text>
          ) : null}

        </View>
      </Pressable>
    </Animated.View>
  );
}

export default memo(MovieCard);