import { StyleSheet, View, ScrollView, TextInput, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { getUserBook, updateBook, deleteUserBook } from "../services/bookServiceAxios";
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
    useTheme,
    List
} from 'react-native-paper';

import { Rating } from 'react-native-ratings';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en);

export default function BookDetailScreen() {
    const { colors, dark } = useTheme();
    const params = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();

    const [book, setBook] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [newTag, setNewTag] = useState('');
    const [rating, setRating] = useState(0);
    const [accordionExpanded, setAccordionExpanded] = useState(false);
    const [statusAccordionExpanded, setStatusAccordionExpanded] = useState(false);

    const [ownership, setOwnership] = useState({
        value: 'Owned',
        list: [
            { _id: "1", value: "Owned" },
            { _id: "2", value: "Rented" },
            { _id: "3", value: "Lent" },
        ],
        selectedList: [{ _id: "1", value: "Owned" }],
        error: ''
    });

    const [readingStatus, setReadingStatus] = useState({
        value: 'Pending',
        list: [
            { _id: "1", value: "Pending" },
            { _id: "2", value: "Reading" },
            { _id: "3", value: "Finished" },
            { _id: "4", value: "Abandoned" },
        ],
        selectedList: [{ _id: "1", value: "Pending" }],
        error: ''
    });

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [openStartPicker, setOpenStartPicker] = useState(false);
    const [openEndPicker, setOpenEndPicker] = useState(false);

    useEffect(() => {
        fetchUserData();
        fetchBookData();
    }, []);

    const fetchBookData = async () => {
        const fetchedBook = await getUserBook(params.bookId as string);
        setBook(fetchedBook);
        setDescription(fetchedBook.comments || '');
        setRating(fetchedBook.rating || 4);
        setReadingStatus({
            ...readingStatus,
            value: fetchedBook.readingStatus || "Pending"
        });
        setStartDate(fetchedBook.startDate ? new Date(fetchedBook.startDate) : undefined);
        setEndDate(fetchedBook.endDate ? new Date(fetchedBook.endDate) : undefined);
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
            rating: rating,
            ownership: parseInt(ownership.selectedList[0]._id),
            readingStatus: parseInt(readingStatus.selectedList[0]._id),
            startDate: startDate,
            endDate: endDate
        });
        alert("Book details saved!");
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
                            <Rating
                                type="custom"
                                ratingCount={5}
                                imageSize={36}
                                startingValue={rating}
                                onFinishRating={setRating}
                                tintColor={colors.background}
                                ratingBackgroundColor={dark ? "#333" : "#c8c8c8"}
                                ratingColor="#ffd700"
                                style={{ paddingVertical: 10 }}
                            />
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <List.Accordion
                        title={`Ownership: ${ownership.value}`}
                        expanded={accordionExpanded}
                        onPress={() => setAccordionExpanded(!accordionExpanded)}
                        style={{
                            backgroundColor: colors.surfaceVariant,
                            borderRadius: 8
                        }}
                    >
                        {ownership.list.map((option) => (
                            <List.Item
                                key={option._id}
                                title={option.value}
                                onPress={() => {
                                    setOwnership({
                                        ...ownership,
                                        value: option.value,
                                        selectedList: [option]
                                    });
                                    setAccordionExpanded(false);
                                }}
                            />
                        ))}
                    </List.Accordion>

                    <List.Accordion
                        title={`Reading Status: ${readingStatus.value}`}
                        expanded={statusAccordionExpanded}
                        onPress={() => setStatusAccordionExpanded(!statusAccordionExpanded)}
                        style={{
                            backgroundColor: colors.surfaceVariant,
                            borderRadius: 8,
                            marginTop: 10
                        }}
                    >
                        {readingStatus.list.map((status) => (
                            <List.Item
                                key={status._id}
                                title={status.value}
                                onPress={() => {
                                    setReadingStatus({
                                        ...readingStatus,
                                        value: status.value,
                                        selectedList: [status]
                                    });
                                    setStatusAccordionExpanded(false);
                                }}
                            />
                        ))}
                    </List.Accordion>

                    <View style={{ marginTop: 15 }}>
                        <Button
                            mode="outlined"
                            onPress={() => setOpenStartPicker(true)}
                            style={{ marginBottom: 10 }}
                        >
                            {startDate ? `Start: ${startDate.toDateString()}` : "Set Start Date"}
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => setOpenEndPicker(true)}
                        >
                            {endDate ? `Finish: ${endDate.toDateString()}` : "Set Finish Date"}
                        </Button>
                    </View>

                    <DatePickerModal
                        locale="en"
                        mode="single"
                        visible={openStartPicker}
                        onDismiss={() => setOpenStartPicker(false)}
                        date={startDate}
                        onConfirm={(params) => {
                            setOpenStartPicker(false);
                            setStartDate(params.date);
                        }}
                    />

                    <DatePickerModal
                        locale="en"
                        mode="single"
                        visible={openEndPicker}
                        onDismiss={() => setOpenEndPicker(false)}
                        date={endDate}
                        onConfirm={(params) => {
                            setOpenEndPicker(false);
                            setEndDate(params.date);
                        }}
                    />

                    <Divider style={styles.divider} />
                    <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Comments</Text>
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
