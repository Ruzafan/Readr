import Book from '@/models/book';
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert, Image, TextInput } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { getBook, assignBookToUser, deleteBook, updateBook } from '@/services/bookServiceAxios';
import {
  Text,
  Card,
  Title,
  Divider,
  Chip,
  Button,
  IconButton,
  useTheme
} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState<Book>(new Book());
  const [isAssigned, setIsAssigned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  const [newGenre, setNewGenre] = useState('');

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
        { text: "Cancel", style: "cancel" },
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

  const handleSaveChanges = async () => {
    try {
      await updateBook({
        bookid: bookId,
        authors: book.authors,
        genres: book.genres,
        description: book.description,
        pages: book.pages
      });
      alert('Changes saved!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes.');
    }
  };

  const handleAddGenre = () => {
    if (newGenre.trim() !== '') {
      setBook({ ...book, genres: [...(book.genres || []), newGenre] });
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (index: number) => {
    setBook({ ...book, genres: book.genres!.filter((_, i) => i !== index) });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card style={styles.card}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.image }} style={styles.coverImage} />
          <View style={styles.bookInfo}>
            <Card.Content>
              <Title>{book.title}</Title>

              {/* Authors */}
              {isEditing ? (
                <TextInput
                  value={book.authors?.join(', ') || ''}
                  onChangeText={(text) => setBook({ ...book, authors: text.split(',') })}
                  placeholder="Authors"
                  style={styles.input}
                  placeholderTextColor={theme.colors.outline}
                />
              ) : (
                <Text style={styles.fieldText}>{book.authors?.join(', ') || 'No authors listed.'}</Text>
              )}

              {/* Genres */}
              <View style={styles.chipsContainer}>
                {book.genres?.map((genre, index) => (
                  <Chip
                    key={index}
                    icon="tag"
                    onClose={isEditing ? () => handleRemoveGenre(index) : undefined}
                    style={styles.chip}
                  >
                    {genre}
                  </Chip>
                ))}
              </View>

              {isEditing && (
                <View style={styles.genreInputRow}>
                  <TextInput
                    value={newGenre}
                    onChangeText={setNewGenre}
                    placeholder="Add genre..."
                    style={[styles.input, { flex: 1 }]}
                    placeholderTextColor={theme.colors.outline}
                  />
                  <Button onPress={handleAddGenre}>+</Button>
                </View>
              )}
            </Card.Content>
          </View>
        </View>

        <Divider style={{ marginTop: 12 }} />

        {/* Description */}
        <Text style={styles.sectionTitle}>Description:</Text>
        <Card.Content>
          {isEditing ? (
            <TextInput
              multiline
              value={book.description}
              onChangeText={(text) => setBook({ ...book, description: text })}
              placeholder="Description..."
              style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
              placeholderTextColor={theme.colors.outline}
            />
          ) : (
            <Text style={styles.fieldText}>{book.description || 'No description available.'}</Text>
          )}
        </Card.Content>

        <Divider style={{ marginTop: 20 }} />

        {/* Pages */}
        <Text style={styles.sectionTitle}>Pages:</Text>
        <Card.Content>
          {isEditing ? (
            <TextInput
              value={book.pages?.toString() || ''}
              onChangeText={(text) => setBook({ ...book, pages: parseInt(text) || 0 })}
              placeholder="Number of pages"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={theme.colors.outline}
            />
          ) : (
            <Text style={styles.fieldText}>{book.pages ? `${book.pages} pages` : 'No page count'}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Assign or Assigned */}
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

      {/* Edit / Save Buttons */}
        <View>
          {!isEditing ? (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            >
              Edit
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSaveChanges}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
          )}
        </View>

      {/* Delete */}
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
  genreInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,
    marginTop: 20,
    marginBottom: 6,
  },
  fieldText: {
    fontSize: 16,
    marginBottom: 8,
  },
  assignButton: {
    marginTop: 16,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#3498db',
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#27ae60',
  },
  confirmCard: {
    padding: 12,
    backgroundColor: '#d1f5d3',
  },
});
