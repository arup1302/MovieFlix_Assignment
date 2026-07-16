import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  subtitle?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  textColor?: string;
  subtitleColor?: string;
  iconColor?: string;
};

export default function Header({
  title,
  subtitle,
  iconName,
  textColor = '#ffffff',
  subtitleColor = '#a1a1aa',
  iconColor = '#ffffff',
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-6">
      <View className="flex-1">
        <Text className="text-4xl font-extrabold tracking-tight" style={{ color: textColor }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-2 text-base font-light" style={{ color: subtitleColor }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {iconName ? <MaterialIcons name={iconName} size={32} color={iconColor} /> : null}
    </View>
  );
}
