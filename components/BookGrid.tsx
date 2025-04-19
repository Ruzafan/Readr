import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Text, useTheme, Chip, IconButton } from "react-native-paper";
import Book from "@/models/book";
import { BookRow } from "./BookRow";
import { getUserBooksList } from "../services/bookServiceAxios";
import React, { useEffect, useState, useMemo } from "react";
import * as SecureStore from 'expo-secure-store';

type BookGridProps = {
  books?: Book[];
  onLoadMore?: () => void;
  loading?: boolean;
};

export function BookGrid({ books, onLoadMore, loading = false }: BookGridProps) {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!books) {
      const fetchBooks = async () => {
        setIsLoadingBooks(true);
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          try {
            const res = await getUserBooksList(page);
            setBookList(res);
          } catch (err) {
            console.error("Error loading books:", err);
          }
        }
        setIsLoadingBooks(false);
      };
      fetchBooks();
    }
  }, [books, page]);

  const dataToRender = books || bookList;

  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    if(!dataToRender) return [];
    dataToRender.forEach(book => {
      book.genres?.forEach(g => genresSet.add(g));
    });
    return Array.from(genresSet).sort();
  }, [dataToRender]);

  const filteredBooks = useMemo(() => {
    if (!selectedGenre) return dataToRender;
    return dataToRender.filter(book => book.genres?.includes(selectedGenre));
  }, [dataToRender, selectedGenre]);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.text, { color: theme.colors.onBackground }]}>My Library</Text>
        {allGenres.length > 0 && (
          <IconButton
            icon={filtersVisible ? "chevron-up" : "chevron-down"}
            onPress={() => setFiltersVisible(!filtersVisible)}
            size={20}
          />
        )}
      </View>

      {filtersVisible && allGenres.length > 0 && (
        <View style={styles.genreContainer}>
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
        </View>
      )}

      {(loading || isLoadingBooks) && <ActivityIndicator style={{ marginTop: 16 }} />}

      {!loading && !isLoadingBooks && (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => <BookRow key={item.id} book={item} customLibrary={true} />}
          numColumns={3}
          contentContainerStyle={styles.bookGrid}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookGrid: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  genreContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});
