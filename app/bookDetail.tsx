import Book from '@/models/book';
import User from '@/models/user';
import {useState, useEffect} from 'react';
import { Image, View, ScrollView,StyleSheet, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getBook, getUserBook, assignBookToUser } from "../services/bookService"; // Import the new service
import { UserId } from '@/constants/UserId';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  Divider, 
  Chip, 
  Avatar,
  Button,
  TextInput
} from 'react-native-paper';
import { Rating } from 'react-native-ratings'; 

const screenWidth = Dimensions.get('window').width;

export default function BookDetailScreen(){
    const local = useLocalSearchParams();
    const {bookId} = local;
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [book, setBook] = useState(new Book());
    const [isAssigned, setIsAssigned] = useState(false); // State to track assignment
    const UserId = "1";
    useEffect(() => {
        const fetchBookData = async () => {
            try{
                const userBookResponse = await getUserBook(UserId, bookId as string);
                if(userBookResponse){
                    setRating(userBookResponse.rating);
                    setComments(userBookResponse.comments);
                    setIsAssigned(true);
                    setBook(userBookResponse);
                }
            }catch(error){
                console.error("Error fetching book:", error);
            }

            if(!isAssigned)
            {
                try {
                    const bookResponse = await getBook(bookId as string);
                    setBook(bookResponse);
                } catch (error) {
                    console.error("Error fetching book:", error);
                    // Handle error, e.g., display an error message
                }
            }
            
        };

        fetchBookData();
    }, [bookId]); // Add bookId to dependency array

    const handleAssignBook = async () => {
        try {
            const userId = "1";
            assignBookToUser(userId, bookId as string,rating, comments).then( () =>{
                setIsAssigned(true);
                alert("Book assigned to you!");
            } ) 
        } catch (error) {
            console.error("Error assigning book:", error);
            alert("Error assigning the book. Please try again.");
        }
    };

      return (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.text}>Title: </Text>
            <Text style={styles.title}>
                     {book.title}
            </Text>
            
            <Image
            source={{ uri: book.image }}
            style={styles.image}
            alt={book.title}
            />
            <Text style={styles.text}>Rating:</Text>       
            <Rating
                type='star'
                ratingCount={5}
                imageSize={40}
                startingValue={rating} // Controlled by state
                onFinishRating={setRating} // Update state on rating change
                style={{ paddingVertical: 10 }}
            />
            <Text style={styles.text}>Comment: </Text>
            <TextInput
                style={{ height: 80, borderColor: 'gray', borderWidth: 1, marginTop: 10, padding: 5 }}
                placeholder="Your comments..."
                multiline={true} // Allow multiple lines
                value={comments} // Controlled by state
                onChangeText={setComments} // Update state on text change
            />
            {!isAssigned &&
                <Button 
                    mode="contained" 
                    onPress={handleAssignBook}
                    disabled={isAssigned} // Disable if already assigned
                    style={{ marginTop: 20 }}
                >
                    {isAssigned ? "Book Assigned" : "Assign Book to Me"} {/* Change button text */}
                </Button>
            }
          </View>
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 100,
        justifyContent: "center",

    },
  image: {
    width: screenWidth / 2,
    height: "70%",
    borderRadius: 12,
    alignSelf: "center"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  }
});