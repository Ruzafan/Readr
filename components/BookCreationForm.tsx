import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  TextInput,
  Button,
  Text,
  Card,
  Surface,
} from 'react-native-paper';

interface BookFormProps {
  onSubmit: (bookData: any) => void;
  onCancel: () => void;
}

export default function BookCreationForm({ onSubmit, onCancel }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('');

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || 'image.jpg';
      const fileType = asset.type || 'image/jpeg';

      setImage({
        uri: asset.uri,
        name: fileName,
        type: fileType,
      });
    }
  };

  const handleCreate = () => {
    if (!title || !author || !description) {
      Alert.alert('Missing Info', 'Please fill out all required fields');
      return;
    }

    const newBook = {
      title,
      author,
      genres: genres.split(',').map((g) => g.trim()),
      description,
      image: image,
      pages: parseInt(pages) || 0,
    };

    onSubmit(newBook);
  };

  return (
   
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Surface style={styles.formSurface}>
            <Text variant="titleLarge" style={styles.formTitle}>Create New Book</Text>

            <TextInput
              label="Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Author *"
              value={author}
              onChangeText={setAuthor}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
                label="Pages"
                value={pages}
                onChangeText={setPages}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
              label="Genres"
              value={genres}
              onChangeText={setGenres}
              mode="outlined"
              placeholder="e.g. Fiction, Mystery"
              style={styles.input}
            />

            <TextInput
              label="Description *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />

            <Button
              mode="contained"
              onPress={pickImage}
              style={styles.imageButton}
            >
              {image ? 'Change Image' : 'Upload Image'}
            </Button>

            {image && (
              <Card style={styles.imageCard}>
                <Card.Cover source={{ uri: image.uri }} style={styles.previewImage} />
              </Card>
            )}

            <View style={styles.buttonRow}>
              <Button mode="outlined" onPress={onCancel} style={styles.flexButton}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleCreate} style={styles.flexButton}>
                Create
              </Button>
            </View>
          </Surface>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'transparent',
    width: '95%'
  },
  formSurface: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  formTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  imageButton: {
    marginBottom: 16,
  },
  imageCard: {
    marginBottom: 16,
  },
  previewImage: {
    height: 200,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flexButton: {
    flex: 1,
  },
});
