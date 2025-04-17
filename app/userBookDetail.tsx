import { StyleSheet, View, ScrollView, TextInput, Alert , Image} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter , useNavigation} from 'expo-router';
import { getUserBook, updateBook, deleteBook, deleteUserBook } from "../services/bookServiceAxios";
import { getUser } from '@/services/userService';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Divider,
  Chip,
  Avatar,
  Button,
  useTheme
} from 'react-native-paper';
import { Rating } from 'react-native-ratings';

export default function BookDetailScreen() {
  const { colors, dark } = useTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [book, setBook] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');
  const [rating, setRating] = useState(4);

  useEffect(() => {
    fetchUserData();
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    const fetchedBook = await getUserBook(params.bookId as string);
    setBook(fetchedBook);
    setDescription(fetchedBook.comments || '');
    setRating(fetchedBook.rating || 4);
    navigation.setOptions({ title: fetchedBook.title || 'Book Detail' });
  };

  const fetchUserData = async () => {
    const fetchedUser = await getUser();
    setUser(fetchedUser);
  };

  const addTag = () => {
    if (newTag.trim() !== '') {
      setBook({ ...book, genres: [...(book.genres || []), newTag] });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setBook({ ...book, genres: book.genres.filter((_: any, i: any) => i !== index) });
  };

  const saveChanges = async () => {
    await updateBook({
      bookid: book.id,
      comments: description,
      genres: book.genres,
      rating
    });
    alert("Book details saved!");
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
              await deleteUserBook(book.id);
              alert("Book deleted.");
              router.replace("/");
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {book && (
        <View>
          <View style={styles.bookCard}>
            <View style={styles.bookRow}>
              <Image source={{ uri: book.image }} style={styles.bookImage} />
              <View style={styles.bookDetails}>
                <Card.Content>
                  <Title style={[styles.bookTitle, { color: colors.onBackground }]}>{book.title}</Title>
                  <Paragraph style={{ color: colors.onBackground }}>{book.authors}</Paragraph>

                  <View style={styles.tagsContainer}>
                    {book.genres?.map((genre: any, index: any) => (
                      <Chip
                        key={index}
                        icon="tag"
                        onClose={() => removeTag(index)}
                        style={styles.tag}
                      >
                        {genre}
                      </Chip>
                    ))}
                  </View>

                  <View style={styles.addTagContainer}>
                    <TextInput
                      placeholder="Add a tag..."
                      placeholderTextColor={colors.outline}
                      value={newTag}
                      onChangeText={setNewTag}
                      style={[
                        styles.tagInput,
                        {
                          borderBottomColor: colors.outline,
                          color: colors.onSurface
                        }
                      ]}
                    />
                    <Button onPress={addTag} mode="contained">+</Button>
                  </View>
                </Card.Content>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />
          <View style={styles.ratingContainer}>
            <Avatar.Image size={40} source={{ uri: user?.image }} />
            <View style={styles.userInfo}>
              <Text style={{ color: colors.onBackground }}>{user?.name}</Text>
              <Rating
                type="custom"
                ratingCount={5}
                imageSize={20}
                startingValue={rating}
                onFinishRating={setRating}
                tintColor={colors.background}
                ratingBackgroundColor={dark ? "#333" : "#c8c8c8"}
                ratingColor="#ffd700"
              />
            </View>
          </View>

          <Divider style={styles.divider} />
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Description</Text>
          <TextInput
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description..."
            placeholderTextColor={colors.outline}
            style={[
              styles.descriptionInput,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.outline,
                color: colors.onSurface
              }
            ]}
          />

          <Divider style={styles.divider} />
          <Button mode="contained" onPress={saveChanges}>Save Changes</Button>
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
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  bookCard: {
    marginBottom: 10
  },
  bookRow: {
    flexDirection: 'row'
  },
  bookImage: {
    width: 150,
    height: 220,
    borderRadius: 8
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bookDetails: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between'
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  tag: {
    marginRight: 5,
    marginBottom: 5
  },
  addTagContainer: {
    flexDirection: 'row',
    marginTop: 8
  },
  tagInput: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 5,
    marginRight: 10
  },
  divider: {
    marginVertical: 15
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userInfo: {
    marginLeft: 10
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  descriptionInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top'
  }
});
