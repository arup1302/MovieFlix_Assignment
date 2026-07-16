
import './global.css';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import RootStackNavigator from './src/navigation/RootStack';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

function AppInner() {
  const { isDark } = useTheme();
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f5f5f5' }} edges={['top', 'bottom']}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
