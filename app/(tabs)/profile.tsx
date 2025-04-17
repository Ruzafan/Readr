import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, View, Image } from 'react-native';

import {
  Avatar,
  Title,
  Divider,
  Caption,
  useTheme,
  Surface,
  Button,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';


import { getUser, uploadProfileImage } from '@/services/userService';

import { router } from 'expo-router';
import User from '@/models/user';

const ProfileScreen = () => {
  const theme = useTheme();
  const [user, setUser] = useState<User>();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<{
    
    
      uri: string;
      name: string;
      type: string;
    } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      console.log(userData)
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('username');
      await SecureStore.deleteItemAsync('password');
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const handleSaveImage = async () => {
    
    if (!image) return;
    

    try {
      await uploadProfileImage(image); // your backend should return the updated user or image url
      
      
      
      setModalVisible(false);
      const updatedUser = await getUser(); // re-fetch to update view
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to upload image:', error);
      
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Surface style={{ padding: 24, margin: 16, borderRadius: 12, elevation: 2 }}>
          <Title style={{ textAlign: 'center' }}>{user?.name}</Title>
          <Avatar.Image
            size={100}
            
            source={{ uri: user?.image }}
            
            style={{ alignSelf: 'center', marginBottom: 16 }}
            onTouchEnd={() => setModalVisible(true)}
          />
          <Title style={{ textAlign: 'center' }}>{user?.name} {user?.surname}</Title>
          <Caption style={{ textAlign: 'center', marginBottom: 8 }}>{user?.userName}</Caption>
        </Surface>

        <Divider style={{ marginVertical: 16 }} />

        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ margin: 16, bottom: 50 }}
          icon="logout"
        >
          Log Out
        </Button>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 20,
          }}>
            <Surface style={{ padding: 20, borderRadius: 12, width: '100%', maxWidth: 350 }}>
              <Text style={{ marginBottom: 10, fontSize: 18, textAlign: 'center' }}>Update Profile Image</Text>
              
              {image && (
                
                <Image source={{ uri: image.uri }}style={{ width: 150, height: 150, alignSelf: 'center', borderRadius: 75 }} />
                
                
              )}
              <Button mode="outlined" onPress={pickImage} style={{ marginTop: 10 }}>Choose Image</Button>
              
              
              <Button mode="contained" onPress={handleSaveImage} style={{ marginTop: 10 }}>Save</Button>
              
              <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>Cancel</Button>
            </Surface>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;
