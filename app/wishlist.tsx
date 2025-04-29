import { BookGrid } from '@/components/BookGrid';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';


export default function WishlistScreen() {
  return (
      <BookGrid wishlist={true} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
