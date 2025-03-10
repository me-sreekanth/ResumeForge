import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'center'
  }
});
