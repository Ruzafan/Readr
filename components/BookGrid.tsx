import { View, StyleSheet, FlatList,Text } from "react-native";
import Book from "@/models/book";
import { BookRow } from "./BookRow";
import { getBooksList } from "../services/bookService";
import React, { useEffect, useState } from "react";
import { UserId } from "@/constants/UserId";
import { ScrollView } from "react-native-gesture-handler";
export function BookGrid() {
  const [bookList, setBookList] = useState(new Array());
  const [page, setPage] = useState(1);
  useEffect(() => {
    getBooks();
  }, [page]);
  const getBooks = () => {
    getBooksList(page).then((res) => {
      setBookList(res);

    });
  };

  const handleMore = () => {
    debugger;
    setPage(page + 1);
  };

  return (
    <View>
      <Text style={styles.text}>My Library</Text>
      <FlatList
        data={bookList}
        style={styles.bookGrid}
        // onEndReached={handleMore}
        renderItem={({ item }) => <BookRow key={item.id} book={item} />}
        numColumns={2}
        scrollEnabled={true}
        
      />
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
  }
});
