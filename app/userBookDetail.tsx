import Book from '@/models/book';
import User from '@/models/user';
import {useState} from 'react';
import { Image, View, ScrollView,StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { getUserBook, getUser } from "../services/bookService";
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
    const local = useLocalSearchParams();
    const { bookId} = local;
    let [book, setBook] = useState(new Book());
    let [user, setUser] = useState(new User());
    debugger;
    getUserBook(UserId, bookId as string).then((response) => 
    {
        setBook(response);
    });

    getUser(UserId as string).then((response) =>
    {
       setUser(response);
    });

      return (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Card>
              <Card.Cover source={{ uri: book.image }} />
              <Card.Content>
                <Title>{book.title}</Title>
                <Paragraph>{book.authors}</Paragraph>
                <Chip icon="tag" style={{ marginRight: 5 }}>{book.genre}</Chip>
              </Card.Content>
            </Card>
    
            <Divider style={{ marginVertical: 10 }} />
    
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image size={40} source={{ uri: user.image }} />
              <View style={{ marginLeft: 10 }}>
                <Text>{user.name}</Text>
                <Rating 
                    type='custom' 
                    ratingCount={5} 
                    imageSize={20} 
                    startingValue={4} 
                    readonly 
                    tintColor="#f0f0f0" 
                    ratingBackgroundColor="#c8c8c8" 
                    ratingColor="#ffd700" 
                    /> 
              </View>
            </View>
    
            <Divider style={{ marginVertical: 10 }} />
    
            <Text style={{ fontWeight: 'bold' }}>Description</Text>
            <Paragraph>{book.sinopsis}</Paragraph>
    
            {/* Add more details here if needed (e.g., publication date, ISBN) */}
          </View>
        </ScrollView>
      );
} 