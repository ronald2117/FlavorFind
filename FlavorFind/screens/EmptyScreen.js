import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const EmptyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>There is nothing here</Text>
    </View>
  );
};

export default EmptyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});