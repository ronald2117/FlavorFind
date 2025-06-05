import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../ThemeContext';


const EmptyScreen = () => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      color: theme.color,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.message}>There is nothing here</Text>
    </View>
  );
};

export default EmptyScreen;
//comment
