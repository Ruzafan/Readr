import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Book from "@/models/book";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export function BookRow({ book, customLibrary }: { book: Book, customLibrary: boolean }) {
  const router = useRouter();

  const handlePress = async () => {
    const route = customLibrary ? "/userBookDetail" : "/bookDetail";
    router.push({
      pathname: route,
      params: { bookId: book.id },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.bookRow}>
        <Image
          source={{ uri: book.image }}
          style={styles.image}
          alt={book.title}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookRow: {
    width: screenWidth / 2 - 30,
    height: 250,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
