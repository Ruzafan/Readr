import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  Modal,
  Text,
} from 'react-native';
import { createBook, getBooksList } from '@/services/bookServiceAxios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookCreationForm from '@/components/BookCreationForm';
import { ActivityIndicator, Searchbar, useTheme, FAB } from 'react-native-paper';
import { BookRow } from '@/components/BookRow';

export default function TabTwoScreen() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [skipEffect, setSkipEffect] = useState(false);

  useEffect(() => {
    if (page === 1 && skipEffect) {
      setSkipEffect(false);
      return;
    }
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const results = await getBooksList(page, searchText);
      if (!results || results.length === 0) {
        setHasMore(false);
      } else {
        setSearchResults(prev => [...prev, ...results]);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewSearch = async () => {
    setLoading(true);
    setSearchResults([]);
    setHasMore(true);
    setSkipEffect(true);
    setPage(1);
    try {
      const results = await getBooksList(1, searchText);
      setSearchResults(results ?? []);
      setHasMore((results?.length ?? 0) > 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (bookData: any) => {
    setModalVisible(false);
    setLoading(true);
    try {
      await createBook(bookData);
      setSearchText(bookData.title);
      await startNewSearch();
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const renderBook = useCallback(
    ({ item }: { item: any }) => (
      <BookRow book={item} customLibrary={false} />
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 12 }}>
        <Searchbar
          placeholder="Search books..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={startNewSearch}
          onIconPress={startNewSearch}
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
            padding: 16,
            paddingBottom: 50 + insets.bottom,
            justifyContent: 'center',
            alignItems: 'center',
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
