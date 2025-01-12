import Book from '@/models/book';
import {useState} from 'react';
import { Image, View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { getUserBook } from "../services/bookService";
import { UserId } from '@/constants/UserId';
export default function UserBookDetail(){
    const local = useLocalSearchParams();
    const { bookId} = local;
    let [book, setBook] = useState(new Book());
    debugger;
    getUserBook(UserId, bookId as string).then((response) => 
    {
        setBook(response);
    });

    return(
        <View>
           <Image source={{ uri: book.image }} style={styles.image} alt={book.title} />
        </View>
    );
}

const styles = StyleSheet.create({
    
    image: {
        width: 150,
        height: 240
    }
  });
  