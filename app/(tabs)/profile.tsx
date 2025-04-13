import React, { useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import {
  Avatar,
  Title,
  Paragraph,
  List,
  Divider,
  Caption,
  useTheme,
  Surface,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { login, getUser } from '@/services/userService';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const theme = useTheme();

  const user = {
    name: 'John Doe',
    username: 'johndoe',
    bio: 'This is a sample bio about the user.',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    phone: '+1 555 123 4567',
    website: 'https://www.example.com',
    social: [
      { icon: 'facebook', link: 'https://www.facebook.com/johndoe' },
      { icon: 'twitter', link: 'https://www.twitter.com/johndoe' },
      { icon: 'instagram', link: 'https://www.instagram.com/johndoe' },
    ],
  };

  const loginRequest = async () => {
    const username = 'Marc';
    const password = 'password';
    const token = await login(username, password);
    await SecureStore.setItemAsync('secure_token', token);
    await SecureStore.setItemAsync('user', username);
    await SecureStore.setItemAsync('password', password);
    const response = await getUser();
    console.log(response);
  };

  useEffect(() => {
    loginRequest();
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Surface style={{ padding: 24, margin: 16, borderRadius: 12, elevation: 2 }}>
          <Avatar.Image
            size={100}
            source={{ uri: 'https://picsum.photos/200' }}
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />
          <Title style={{ textAlign: 'center' }}>{user.name}</Title>
          <Caption style={{ textAlign: 'center', marginBottom: 8 }}>{user.username}</Caption>
          <Paragraph style={{ textAlign: 'center' }}>{user.bio}</Paragraph>
        </Surface>

        <List.Section title="Contact">
          <List.Item
            title="Location"
            description={user.location}
            left={(props) => <List.Icon {...props} icon="map-marker" />}
          />
          <List.Item
            title="Email"
            description={user.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Phone"
            description={user.phone}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Website"
            description={user.website}
            left={(props) => <List.Icon {...props} icon="web" />}
            onPress={() => Linking.openURL(user.website)}
          />
        </List.Section>

        <List.Section title="Social">
          {user.social.map((social) => (
            <List.Item
              key={social.icon}
              title={social.icon.charAt(0).toUpperCase() + social.icon.slice(1)}
              left={(props) => <List.Icon {...props} icon={social.icon} />}
              onPress={() => Linking.openURL(social.link)}
            />
          ))}
        </List.Section>

        <Divider style={{ marginVertical: 16 }} />

        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ margin: 16, bottom: 50 }}
          icon="logout"
        >
          Log Out
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;
