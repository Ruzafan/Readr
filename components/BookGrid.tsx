import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Book from "@/models/book";
import { BookRow } from "./BookRow";
import { getBooksList, getUserBooksList } from "../services/bookServiceAxios";
import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

type BookGridProps = {
  books?: Book[];
  onLoadMore?: () => void;
  loading?: boolean;
};

export function BookGrid({ books, onLoadMore, loading = false }: BookGridProps) {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const theme = useTheme();

  useEffect(() => {
    if (!books) {
      SecureStore.getItemAsync('token').then((token) => {
        if (token) {
          getUserBooksList(page).then((res) => {
            setBookList(res);
          });
        } else {
          getBooks();
        }
      });
    }
  }, [books, page]);

  const getBooks = () => {
    getBooksList(page, "").then((res) => {
      setBookList(res);
    });
  };

  const handleMore = () => {
    setPage((prevPage) => prevPage + 1);
    onLoadMore?.();
  };

  const dataToRender = books || bookList;

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Text style={[styles.text, { color: theme.colors.onBackground }]}>
        My Library
      </Text>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {!loading && (
        <FlatList
          data={dataToRender}
          style={styles.bookGrid}
          onEndReached={books ? onLoadMore : handleMore}
          renderItem={({ item }) => <BookRow key={item.id} book={item} customLibrary={true} />}
          numColumns={2}
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
});
