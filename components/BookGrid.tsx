import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { Text, useTheme, Chip } from "react-native-paper";
import Book from "@/models/book";
import { BookRow } from "./BookRow";
import { getBooksList, getUserBooksList } from "../services/bookServiceAxios";
import React, { useEffect, useState, useMemo } from "react";
import * as SecureStore from 'expo-secure-store';

type BookGridProps = {
  books?: Book[];
  onLoadMore?: () => void;
  loading?: boolean;
};

export function BookGrid({ books, onLoadMore }: BookGridProps) {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const res = token
        ? await getUserBooksList(page)
        : await getBooksList(page, "");
      setBookList(res ?? []);
    } catch (e) {
      console.error("Failed to load books:", e);
      setBookList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!books) {
      fetchBooks();
    }
  }, [books, page]);

  const dataToRender = books ?? bookList;

  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    (dataToRender ?? []).forEach(book => {
      book.genres?.forEach(g => genresSet.add(g));
    });
    return Array.from(genresSet).sort();
  }, [dataToRender]);

  const filteredBooks = useMemo(() => {
    if (!selectedGenre) return dataToRender ?? [];
    return (dataToRender ?? []).filter(book => book.genres?.includes(selectedGenre));
  }, [dataToRender, selectedGenre]);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Text style={[styles.text, { color: theme.colors.onBackground }]}>My Library</Text>

      {allGenres.length > 0 && (
        <ScrollView horizontal contentContainerStyle={styles.genreContainer}>
          {allGenres.map((genre) => (
            <Chip
              key={genre}
              mode="outlined"
              selected={genre === selectedGenre}
              onPress={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
              style={styles.genreChip}
            >
              {genre}
            </Chip>
          ))}
        </ScrollView>
      )}

      {isLoading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {!isLoading && filteredBooks.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20, color: theme.colors.onBackground }}>
          No books found.
        </Text>
      )}

      {!isLoading && filteredBooks.length > 0 && (
        <FlatList
          data={filteredBooks}
          style={styles.bookGrid}
          renderItem={({ item }) => <BookRow key={item.id} book={item} customLibrary={true} />}
          numColumns={3}
          scrollEnabled
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookGrid: {
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  genreContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  genreChip: {
    marginRight: 8,
  },
});
