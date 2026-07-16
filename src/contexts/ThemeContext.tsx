import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'theme:isDark';

type ThemeContextValue = {
  isDark: boolean;
  toggle: () => Promise<void>;
  setDark: (v: boolean) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(THEME_KEY).then((value) => {
      if (!mounted) return;
      if (value === '0') setIsDark(false);
      else if (value === '1') setIsDark(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setDark = useCallback(async (v: boolean) => {
    setIsDark(v);
    try {
      await AsyncStorage.setItem(THEME_KEY, v ? '1' : '0');
    } catch {}
  }, []);

  const toggle = useCallback(async () => {
    await setDark(!isDark);
  }, [isDark, setDark]);

  return <ThemeContext.Provider value={{ isDark, toggle, setDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
