// app/(tabs)/friend/[username].tsx

import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  useTheme,
  Surface,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getFriendsWishlist }from "@/services/bookServiceAxios";
import { getFriendInfo } from "@/services/userService";
import User from "@/models/user";
import Book from "@/models/book";
import { BookGrid } from "@/components/BookGrid";

const FriendProfileScreen = () => {
  const theme = useTheme();
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const [friend, setFriend] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Array<Book> | null>(null);
  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const data = await getFriendInfo(friendId);
        setFriend(data);
        setWishlist(await getFriendsWishlist(friendId))
      } catch (error) {
        console.error("Failed to fetch friend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, [friendId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (!friend) {
    return (
      <Surface style={{ margin: 24, padding: 20, borderRadius: 12 }}>
        <Title>User not found</Title>
      </Surface>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Surface
          style={{ padding: 24, margin: 16, borderRadius: 12, elevation: 2 }}
        >
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Avatar.Image size={100} source={{ uri: friend.image }} />
          </View>
          <Title style={{ textAlign: "center" }}>
            {friend.name} {friend.surname}
          </Title>
          <Caption style={{ textAlign: "center" }}>{friend.userName}</Caption>
        </Surface>

        <Divider style={{ marginVertical: 16 }} />

        <Title style={{ marginHorizontal: 16, marginBottom: 8 }}>
          Wishlist
        </Title>
        <BookGrid books={wishlist || []} wishlist={true} />
      </SafeAreaView>
    </ScrollView>
  );
};

export default FriendProfileScreen;
