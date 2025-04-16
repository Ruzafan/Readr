import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BookGrid } from '@/components/BookGrid';
import Login from '@/components/Login';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Surface, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        setLoading(true);
        try {
          const storedToken = await SecureStore.getItemAsync('token');
          setToken(storedToken || '');
        } catch (error) {
          console.error('Error retrieving token:', error);
        } finally {
          setLoading(false);
        }
      };

      checkToken();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {loading ? (
        <Surface style={styles.loadingContainer} elevation={2}>
          <ActivityIndicator animating={true} size="large" />
        </Surface>
      ) : token != '' ? (
        <BookGrid />
      ) : (
        <Login onLoginSuccess={setToken} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
});
