import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import {
    Avatar,
    Title,
    Paragraph,
    List,
    Divider,
    Caption
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
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

    return (
        <ScrollView style={{ flex: 1 }}>
            <SafeAreaView>

                <View style={{ padding: 20 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Avatar.Image
                            size={100}
                            source={{ uri: 'https://picsum.photos/200' }}
                        />
                        <Title>{user.name}</Title>
                        <Caption>{user.username}</Caption>
                        <Paragraph>{user.bio}</Paragraph>
                    </View>

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
                        />
                    </List.Section>

                    <List.Section title="Social">
                        {user.social.map((social) => (
                            <List.Item
                                key={social.icon}
                                title={social.icon}
                                left={(props) => <List.Icon {...props} icon={`social-${social.icon}`} />}
                                onPress={() => Linking.openURL(social.link)}
                            />
                        ))}
                    </List.Section>

                    <Divider />

                    {/* Add more sections here if needed */}
                </View>
            </SafeAreaView>

        </ScrollView>
    );
};

export default ProfileScreen;