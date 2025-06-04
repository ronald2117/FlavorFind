// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

const LightTheme = {
  mode: 'light',
  background: '#EEEFFF',
  text: '#000000',
  card: '#111111',
  inputBG: '#B8B8B8',
  buttonBG: '#B8B8B8',
};

const DarkTheme = {
  mode: 'dark',
  background: '#111111',
  text: '#ffffff',
  card: '#1a1a1a',
  inputBG: '#2B2B2B',
  buttonBG: '#3B3B3B',
};

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark'
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const theme = isDark ? DarkTheme : LightTheme;

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
