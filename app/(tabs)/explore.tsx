import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
  Modal,
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await getBooksList(1, searchText);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleCreateBook = async (bookData: any) => {
    setModalVisible(false);
    setLoading(true);
    try {
      await createBook(bookData);
      setSearchText(bookData.title);
      await handleSearch();
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 12 }}>
        <Searchbar
          placeholder="Search books..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
          loading={loading}
        />
      </View>

      {loading && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BookRow key={item.id} book={item} customLibrary={false} />}
          numColumns={2}
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