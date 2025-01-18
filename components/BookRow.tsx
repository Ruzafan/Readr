import { Image, View, StyleSheet, Platform,Text, Dimensions } from "react-native";
import Book from "@/models/book";
import { Link } from "expo-router";

const screenWidth = Dimensions.get('window').width;

export function BookRow({ book }: { book: Book }) {
  

  return (
          <Link
        href={{
          pathname: "/userBookDetail",
          params: { bookId: book.id },
        }}
      >
        
        <View style={styles.bookRow}>
        
          <Image
            source={{ uri: book.image }}
            style={styles.image}
            alt={book.title}
          />
        </View>
      </Link>
  );
}

const styles = StyleSheet.create({
  bookRow: {
    width: screenWidth / 2 -30,
    height: 250,
    //backgroundColor: "#222629",
    borderRadius: 10,
    color: "white",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    padding: 10,
    cursor: "pointer",
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  }
});
