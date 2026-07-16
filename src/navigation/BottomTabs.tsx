import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStack';
import SearchScreen from '../screens/Search';
import ProfileScreen from '../screens/Profile';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff6b6b',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { 
          backgroundColor: '#111827',
          borderTopColor: 'transparent',
          paddingBottom: 10,
          paddingTop: 12,
          height: 72,
          elevation: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'HomeStack'
              ? 'home'
              : route.name === 'Search'
              ? 'search'
              : 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarBackground: () => (
          <View style={{
            flex: 1,
            backgroundColor: '#111827',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }} />
        ),
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
