import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  Modal,
  Text,
  Platform, // Import Platform
} from 'react-native';
import { createBook, getBooksList } from '@/services/bookServiceAxios';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookCreationForm from '@/components/BookCreationForm';
import { ActivityIndicator, Searchbar, useTheme, FAB } from 'react-native-paper';
import { BookRow } from '@/components/BookRow';

export default function TabTwoScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hasLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        setPage(1);
        fetchBooks(1, searchText, true);
      }
    }, [])
  );


  useEffect(() => {
    if (page === 1 || !hasMore) return;
    fetchBooks(page, searchText);
  }, [page]);

  const fetchBooks = async (pageNumber: number, text: string, reset: boolean = false) => {
    if (loading) return;

    if (page <= 1)
      setLoading(true);

    try {
      const results = await getBooksList(pageNumber, text);
      if (reset) {
        setSearchResults(results ?? []);
      } else {
        setSearchResults(prev => [...prev, ...(results ?? [])]);
      }
      setHasMore((results?.length ?? 0) >= 20);
    } catch (error) {
      console.error('Search error:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setPage(1);
    fetchBooks(1, searchText, true);
  };

  const handleMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleCreateBook = async (bookData: any) => {
    setModalVisible(false);
    setLoading(true);
    try {
      await createBook(bookData);
      setSearchText(bookData.title);
      setPage(1);
      fetchBooks(1, bookData.title, true);
    } catch (error) {
      console.error('Error creating book:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBook = useCallback(
    ({ item }: { item: any }) => <BookRow book={item} customLibrary={false} />,
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Apply paddingTop conditionally for Android */}
      <View style={{ paddingHorizontal: 12, paddingTop: Platform.OS === 'android' ? insets.top : 12, paddingBottom: 12 }}>
        <Searchbar
          placeholder="Search books..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          onIconPress={handleSearchSubmit}
        />
      </View>

      {loading && searchResults.length === 0 && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && searchResults.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.onBackground }}>
          No books found.
        </Text>
      )}

      {!loading && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBook}
          numColumns={3}
          onEndReached={handleMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          initialNumToRender={12}
          contentContainerStyle={{
            padding: 6,
            paddingBottom: 50 + insets.bottom,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
          style={{ flex: 1 }}
        />
      )}

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          bottom: 55 + insets.bottom,
          right: 24,
        }}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      />

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.elevation.level2,
              borderRadius: 12,
              maxHeight: '90%',
              width: '95%',
              overflow: 'hidden',
            }}
          >
            <BookCreationForm
              onSubmit={handleCreateBook}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
