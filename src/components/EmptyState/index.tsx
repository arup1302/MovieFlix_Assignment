import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Surface } from 'react-native-paper';
import { strings } from '../../constants/strings';

type Props = {
  onRetry: () => void;
};

export default function EmptyState({ onRetry }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-black px-6 py-20">
      <Surface
        style={{
          width: '100%',
          maxWidth: 360,
          alignItems: 'center',
          borderRadius: 28,
          backgroundColor: '#111827',
          paddingHorizontal: 24,
          paddingVertical: 28,
          elevation: 4,
        }}
      >
        <View className="mb-6 rounded-full bg-red-500/20 p-6">
          <MaterialIcons name="movie-filter" size={48} color="#ff6b6b" />
        </View>
        <Text className="mb-3 text-3xl font-bold text-white">{strings.emptyState.title}</Text>
        <Text className="mb-10 text-center text-base font-light text-zinc-400">
          {strings.emptyState.subtitle}
        </Text>
        <Button
          mode="contained"
          onPress={onRetry}
          buttonColor="#ff6b6b"
          textColor="#ffffff"
          icon={({ size, color }) => <MaterialIcons name="refresh" size={size} color={color} />}
          contentStyle={{ height: 52 }}
          style={{ borderRadius: 16, width: '100%' }}
        >
          {strings.emptyState.cta}
        </Button>
      </Surface>
    </View>
  );
}
