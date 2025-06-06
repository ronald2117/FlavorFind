import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../ThemeContext';

const CustomSplashScreen = ({ onReady }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onReady();
    };

    prepare();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    image: {
      width: 220,
      height: 200,
      marginBottom: 20,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#00',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={theme.mode == 'light' ? require('../assets/welcome-icon.png') : require('../assets/welcome-icon-dark-mode.png')}  width={220} height={220} />
      <Text style={styles.text}>Nomadic. Nostalgic. New.</Text>
    </View>
  );
};



export default CustomSplashScreen;