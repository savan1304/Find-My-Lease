import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapHolder = () => (
  <View style={styles.container}>
    <Text>Map will be displayed here</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333',
  }
});

export default MapHolder;
