import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Modal,
  View,
  Image,
  RefreshControl,
} from "react-native";
import {
  Avatar,
  Title,
  Divider,
  Caption,
  useTheme,
  Surface,
  Button,
  Text,
  IconButton,
  FAB,
  List,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { getUser, uploadProfileImage, addFriend } from "@/services/userService";
import User from "@/models/user";
import { useRouter, useFocusEffect } from "expo-router";

const ProfileScreen = () => {
  const theme = useTheme();
  const [user, setUser] = useState<User>();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const router = useRouter();
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    const userData = await getUser();
    setUser(userData);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUser();
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("username");
      await SecureStore.deleteItemAsync("password");
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
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
      const fileName = asset.uri.split("/").pop() || "image.jpg";
      const fileType = asset.type || "image/jpeg";

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
      await uploadProfileImage(image);
      setModalVisible(false);
      fetchUser();
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const sendFriendRequest = async (friendName = "" ) => {
    if(friendName) {
      setFriendUsername(friendName);
    }
    if (!friendUsername.trim()) return;

    try {
      await addFriend(friendUsername);
      setFriendUsername("");
      setFriendModalVisible(false);
      fetchUser();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <Surface
          style={{ padding: 24, margin: 16, borderRadius: 12, elevation: 2 }}
        >
          <Title style={{ textAlign: "center" }}>{user?.userName}</Title>

          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <View style={{ position: "relative" }}>
              <Avatar.Image size={100} source={{ uri: user?.image }} />
              <IconButton
                icon="pencil"
                size={20}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -10,
                  backgroundColor: theme.colors.elevation.level2,
                }}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </View>

          <Title style={{ textAlign: "center" }}>
            {user?.name} {user?.surname}
          </Title>
        </Surface>

        <Divider style={{ marginVertical: 16 }} />

        {/* Friends List */}
        <Surface
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Title>Friends</Title>
            <IconButton
              icon="account-plus"
              size={24}
              onPress={() => setFriendModalVisible(true)}
              accessibilityLabel="Add Friend"
            />
          </View>

          {user?.friends && user.friends.length > 0 ? (
            user.friends.map((friend, index) => (
              <List.Item
                key={index}
                title={friend.userName}
                left={() => (
                  <Avatar.Image size={40} source={{ uri: friend.image }} />
                )}
                right={() =>
                  friend.status === 0 ? (
                    <IconButton
                    icon="clock-outline"
                    onPress={() => sendFriendRequest(friend.userName)}
                    />
                  ) : null
                }
                onPress={() => {
                  if (friend.status === 1) {
                    router.push({
                      pathname: "/FriendProfileScreen",
                      params: { friendId: friend.id },
                    });
                  }
                }}
              />
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.onSurfaceVariant,
              }}
            >
              No friends yet
            </Text>
          )}
        </Surface>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ margin: 16, marginBottom: 100 }}
          icon="logout"
        >
          Log Out
        </Button>

        {/* Wishlist FAB */}
        <FAB
          icon="heart"
          label="Wishlist"
          style={{
            position: "absolute",
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
          }}
          onPress={() => router.push("/wishlist")}
        />

        {/* Image Picker Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 20,
            }}
          >
            <Surface
              style={{
                padding: 20,
                borderRadius: 12,
                width: "100%",
                maxWidth: 350,
              }}
            >
              <Text
                style={{ marginBottom: 10, fontSize: 18, textAlign: "center" }}
              >
                Update Profile Image
              </Text>

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: 150,
                    height: 150,
                    alignSelf: "center",
                    borderRadius: 75,
                  }}
                />
              )}
              <Button
                mode="outlined"
                onPress={pickImage}
                style={{ marginTop: 10 }}
              >
                Choose Image
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveImage}
                style={{ marginTop: 10 }}
              >
                Save
              </Button>
              <Button
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            </Surface>
          </View>
        </Modal>

        {/* Add Friend Modal */}
        <Modal visible={friendModalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 20,
            }}
          >
            <Surface
              style={{
                padding: 20,
                borderRadius: 12,
                width: "100%",
                maxWidth: 350,
              }}
            >
              <Text
                style={{ marginBottom: 10, fontSize: 18, textAlign: "center" }}
              >
                Send Friend Request
              </Text>
              <TextInput
                label="Username"
                value={friendUsername}
                onChangeText={setFriendUsername}
                style={{ marginBottom: 16 }}
              />
              <Button mode="contained" onPress={() => sendFriendRequest("")}>
                Send
              </Button>
              <Button
                onPress={() => setFriendModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            </Surface>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;
