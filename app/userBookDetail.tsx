import Book from '@/models/book';
import {useState} from 'react';
import { Image, View, ScrollView,StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { getUserBook } from "../services/bookService";
import { UserId } from '@/constants/UserId';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  Divider, 
  Chip, 
  Avatar
} from 'react-native-paper';
import { Rating } from 'react-native-ratings'; 

export default function BookDetailScreen(){
    /*const local = useLocalSearchParams();
    const { bookId} = local;
    let [book, setBook] = useState(new Book());
    debugger;
    getUserBook(UserId, bookId as string).then((response) => 
    {
        setBook(response);
    });*/
    const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        description: 'A young hobbit named Frodo Baggins finds himself the unexpected bearer of The One Ring, a powerful artifact sought by the Dark Lord Sauron.',
        coverImage: 'https://example.com/lord-of-the-rings-cover.jpg',
        userRating: 4.5, 
        user: {
          name: 'John Doe',
          avatarUrl: 'https://picsum.photos/50/50',
        }
      };

      return (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Card>
              <Card.Cover source={{ uri: book.coverImage }} />
              <Card.Content>
                <Title>{book.title}</Title>
                <Paragraph>{book.author}</Paragraph>
                <Chip icon="tag" style={{ marginRight: 5 }}>{book.genre}</Chip>
              </Card.Content>
            </Card>
    
            <Divider style={{ marginVertical: 10 }} />
    
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image size={40} source={{ uri: book.user.avatarUrl }} />
              <View style={{ marginLeft: 10 }}>
                <Text>{book.user.name}</Text>
                <Rating 
                    type='custom' 
                    ratingCount={5} 
                    imageSize={20} 
                    startingValue={book.userRating} 
                    readonly 
                    tintColor="#f0f0f0" 
                    ratingBackgroundColor="#c8c8c8" 
                    ratingColor="#ffd700" 
                    /> 
              </View>
            </View>
    
            <Divider style={{ marginVertical: 10 }} />
    
            <Text style={{ fontWeight: 'bold' }}>Description</Text>
            <Paragraph>{book.description}</Paragraph>
    
            {/* Add more details here if needed (e.g., publication date, ISBN) */}
          </View>
        </ScrollView>
      );
} 