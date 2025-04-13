import Book from '@/models/book';
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getBook, assignBookToUser } from '@/services/bookServiceAxios';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  Divider, 
  Chip, 
  Button, 
  TextInput,
  useTheme 
} from 'react-native-paper';
import { Rating } from 'react-native-ratings';

const screenWidth = Dimensions.get('window').width;

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState(new Book());
  const [isAssigned, setIsAssigned] = useState(false);
  const [rating, setRating] = useState(3);
  const [comments, setComments] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchBookData();
  }, [isAssigned]);

  const fetchBookData = async () => {
    try {
      const bookResponse = await getBook(bookId as string);
      setBook(bookResponse);
      setIsAssigned(false);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const handleAssignBook = async () => {
    try {
      await assignBookToUser(bookId as string, rating, comments);
      setIsAssigned(true);
      alert('Book assigned to you!');
    } catch (error) {
      console.error('Error assigning book:', error);
      alert('Error assigning the book. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Card style={styles.card}>
        <View style={styles.coverContainer}>
          <Card.Cover source={{ uri: book.image }} style={styles.coverImage} />
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
      </Card> 

      <Card style={styles.descriptionCard}>
        <Card.Content>
          <Text variant="bodyMedium">{book.description || 'No description available.'}</Text>
        </Card.Content>
      </Card>

      {!isAssigned && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Rate this book</Text>
            <Rating
              startingValue={rating}
              onFinishRating={setRating}
              imageSize={28}
              tintColor={theme.colors.background}
              ratingBackgroundColor="#ccc"
              style={{ marginVertical: 10 }}
            />

            <TextInput
              label="Comments (optional)"
              value={comments}
              onChangeText={setComments}
              multiline
              numberOfLines={3}
              mode="outlined"
              style={{ marginTop: 12 }}
            />

            <Button
              mode="contained"
              onPress={handleAssignBook}
              style={styles.assignButton}
            >
              Assign Book to Me
            </Button>
          </Card.Content>
        </Card>
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
