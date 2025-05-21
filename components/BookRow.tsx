import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Book from "@/models/book";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { wishlist } from "../services/bookServiceAxios";

const screenWidth = Dimensions.get("window").width;

export function BookRow({ book, customLibrary }: { book: Book, customLibrary: boolean}) {
  const router = useRouter();
  const [wished, setWished] = useState(book.wished || false);
  const handlePress = () => {
    const route = customLibrary ? "/userBookDetail" : "/bookDetail";
    router.push({
      pathname: route,
      params: { bookId: book.id },
    });
  };

  const handleWishlist = () => {
    wishlist(book.id as string);
    book.wished = !book.wished;
    setWished(book.wished);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={{ uri: book.image }}
          style={styles.image}
          alt={book.title}
        />
      </TouchableOpacity>
      {!customLibrary &&
        <IconButton
          icon={book.wished ? "heart" : "heart-outline"}
          size={20}
          onPress={handleWishlist}
          style={styles.wishlistButton}
          iconColor={wished? "red" : "white"}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth / 3 - 5,
    height: 180,
    borderRadius: 10,
    justifyContent: "center",
    padding: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  wishlistButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
