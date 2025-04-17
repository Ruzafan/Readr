import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
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
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : token != '' ? (
        <BookGrid />
      ) : (
        <Login onLoginSuccess={setToken} />
      )}
    </SafeAreaView>
  );
}


