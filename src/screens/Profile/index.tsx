import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { strings } from '../../constants/strings';
import FallbackImage from '../../components/FallbackImage';
import Loading from '../../components/Loading';

function SettingRow({
  icon,
  label,
  value,
  onPress,
  isDark,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isDark: boolean;
}) {
  const textColor = isDark ? '#ffffff' : '#111827';
  const subTextColor = isDark ? '#9ca3af' : '#6b7280';
  const iconBg = isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
  const cardBg = isDark ? '#1f2937' : '#ffffff';

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 flex-row items-center justify-between rounded-2xl border px-6 py-4"
      style={{ 
        backgroundColor: cardBg, 
        borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1
      }}
    >
      <View className="flex-row items-center gap-4">
        <View className="rounded-xl p-3" style={{ backgroundColor: iconBg }}>
          <MaterialIcons name={icon} size={24} color={isDark ? '#ff6b6b' : '#ff6b6b'} />
        </View>
        <View>
          <Text className="text-base font-semibold" style={{ color: textColor }}>
            {label}
          </Text>
          {value ? (
            <Text className="mt-1 text-xs font-medium" style={{ color: subTextColor }}>
              {value}
            </Text>
          ) : null}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={isDark ? '#6b7280' : '#d1d5db'} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { isDark, toggle } = useTheme();
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [displayName, setDisplayName] = useState(strings.profile.name);
  const [username, setUsername] = useState(strings.profile.username);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const onToggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => {
      const next = !prev;
      Alert.alert(
        strings.profile.notifications,
        next ? strings.profile.notificationsEnabledMsg : strings.profile.notificationsDisabledMsg
      );
      return next;
    });
  }, []);

  const onOpenPrivacy = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(strings.profile.privacyUrl);
      if (!canOpen) {
        Alert.alert(strings.profile.privacy, strings.profile.privacyError);
        return;
      }

      await Linking.openURL(strings.profile.privacyUrl);
    } catch {
      Alert.alert(strings.profile.privacy, strings.profile.privacyError);
    }
  }, []);

  const onLogout = useCallback(() => {
    Alert.alert(strings.profile.logout, strings.profile.logoutConfirmMessage, [
      { text: strings.profile.cancel, style: 'cancel' },
      {
        text: strings.profile.confirmLogout,
        style: 'destructive',
        onPress: () => {
          setIsLoggingOut(true);
          setTimeout(() => {
            setIsLoggingOut(false);
            setIsLoggedOut(true);
            setUsername('');
            setDisplayName(strings.profile.signedOutUser);
            Alert.alert(strings.profile.logout, strings.profile.logoutSuccess);
          }, 800);
        },
      },
    ]);
  }, []);

  const textColor = isDark ? '#ffffff' : '#111827';
  const subTextColor = isDark ? '#9ca3af' : '#6b7280';
  const cardBg = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';

  if (loading) {
    return <Loading variant="profile" />;
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f5f5f5' }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="mb-8 text-3xl font-bold" style={{ color: textColor }}>{strings.profile.title}</Text>
      
      <View 
        className="items-center rounded-3xl border p-8 mb-10" 
        style={{ 
          backgroundColor: cardBg, 
          borderColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3
        }}
      >
        <FallbackImage
          source={{ uri: strings.profile.profileImageUrl }}
          contentFit="cover"
          style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            borderWidth: 4,
            borderColor: '#ff6b6b',
            marginBottom: 24,
          }}
        />
        <Text className="text-3xl font-bold" style={{ color: textColor }}>{displayName}</Text>
        {username ? (
          <Text className="mt-1 text-sm font-semibold" style={{ color: subTextColor }}>
            {username}
          </Text>
        ) : null}
        <Text className="mt-2 text-center text-sm font-medium" style={{ color: subTextColor }}>
          {strings.profile.subtitle}
        </Text>
      </View>

      <View className="mb-8">
        <Text className="mb-4 text-sm font-bold uppercase tracking-wide" style={{ color: subTextColor }}>
          {strings.profile.settings}
        </Text>
        <SettingRow 
          icon="dark-mode" 
          label={strings.profile.darkMode} 
          value={isDark ? strings.profile.enabled : strings.profile.disabled} 
          onPress={toggle} 
          isDark={isDark} 
        />
        <SettingRow
          icon="notifications"
          label={strings.profile.notifications}
          value={notificationsEnabled ? strings.profile.on : strings.profile.off}
          onPress={onToggleNotifications}
          isDark={isDark}
        />
        <SettingRow
          icon="shield"
          label={strings.profile.privacy}
          value={strings.profile.viewPolicy}
          onPress={onOpenPrivacy}
          isDark={isDark}
        />
        <SettingRow
          icon="logout"
          label={strings.profile.logout}
          value={isLoggingOut ? strings.profile.loggingOut : isLoggedOut ? strings.profile.signedOut : undefined}
          onPress={onLogout}
          isDark={isDark}
        />
      </View>
    </ScrollView>
  );
}
