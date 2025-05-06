import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '../components/Logo';

const CustomSplashScreen = ({ onReady }) => {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onReady();
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
        <Logo style={styles.image} />
      <Text style={styles.text}>Nomadic. Nostalgic. New.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CustomSplashScreen;