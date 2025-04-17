import Book from '@/models/book';
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { getBook, assignBookToUser, deleteBook } from '@/services/bookServiceAxios';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Divider,
  Chip,
  Button,
  useTheme
} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState(new Book());
  const [isAssigned, setIsAssigned] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();
  

  useEffect(() => {
    fetchBookData();
  }, [isAssigned]);

  const fetchBookData = async () => {
    try {
      const bookResponse = await getBook(bookId as string);
      setBook(bookResponse);
      navigation.setOptions({ title: bookResponse.title || 'Book Detail' });
      setIsAssigned(bookResponse.isAssigned);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const handleAssignBook = async () => {
    try {
      await assignBookToUser(bookId as string);
      setIsAssigned(true);
      alert('Book assigned to you!');
    } catch (error) {
      console.error('Error assigning book:', error);
      alert('Error assigning the book. Please try again.');
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book from your library?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(bookId as string);
              alert("Book deleted.");
              router.back();
            } catch (error) {
              console.error("Error deleting book:", error);
              alert("Failed to delete the book.");
            }
          }
        }
      ]
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card style={styles.card}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.image }} style={styles.coverImage} />
          <View style={styles.bookInfo}>
            <Card.Content>
              <Title>{book.title}</Title>
              <Paragraph>{book.authors}</Paragraph>
              <View style={styles.chipsContainer}>
                {book.genres?.map((genre, index) => (
                  <Chip key={index} icon="tag" style={styles.chip}>
                    {genre}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </View>
        </View>
        <Divider />
        <Text style={{ fontWeight: 'bold', marginLeft: 12, marginTop: 20 }}>Description: </Text>
        <Card.Content>
          <Text variant="bodyMedium">{book.description || 'No description available.'}</Text>
        </Card.Content>
      </Card>

      {!isAssigned && (
            <Button
              mode="contained"
              onPress={handleAssignBook}
              style={styles.assignButton}
            >
              Assign Book to Me
            </Button>
      )}

      {isAssigned && (
        <Card style={styles.confirmCard}>
          <Card.Content>
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              ✅ This book has been assigned to you.
            </Text>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={{ marginTop: 10 }}
        buttonColor="red"
        textColor="white"
        icon="delete"
      >
        Delete Book
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  coverContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  descriptionCard: {
    marginBottom: 16,
    padding: 8,
  },
  formCard: {
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  assignButton: {
    marginTop: 16,
  },
  confirmCard: {
    padding: 12,
    backgroundColor: '#d1f5d3',
  },
});
