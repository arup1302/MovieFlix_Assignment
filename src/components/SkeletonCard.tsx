import { View } from 'react-native';

export default function SkeletonCard() {
  return (
    <View 
      className="mr-4 rounded-2xl p-0 overflow-hidden"
      style={{ 
        width: 220,
        backgroundColor: '#374151',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2
      }}
    >
      <View className="h-64 w-full bg-gradient-to-b from-zinc-700 to-zinc-800" />
      <View className="p-4">
        <View className="mb-3 h-5 w-4/5 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-600" />
        <View className="h-4 w-3/4 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-800" />
      </View>
    </View>
  );
}
