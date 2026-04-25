import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "@/api/axios";
import { router } from "expo-router";

export default function Create() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string[];
    description?: string[];
    image?: string[];
  }>({});

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleCreateBlog = async () => {
    const newErrors: typeof errors = {};

    if (!title) newErrors.title = ["Title is required"];
    if (!description) newErrors.description = ["Description is required"];
    if (!image?.uri) newErrors.image = ["Image is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post(
        "/create/blog",
        {
          title,
          image: image?.file,
          description,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Blog created!");
      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-1200 pt-20">
      <View className="bg-white p-4 rounded-2xl gap-4">

        <Text className="text-xl font-extrabold text-[#1877f2] pb-5">
          What's on your mind?
        </Text>

    
        <View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="h-12 px-4 border border-gray-300 rounded-xl bg-gray-50"
            placeholder="Enter title"
          />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.title[0]}
            </Text>
          )}
        </View>

      
        <View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="h-24 px-4 border border-gray-300 rounded-xl bg-gray-50"
            placeholder="Write something..."
            multiline
            textAlignVertical="top"
          />
          {errors.description && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.description[0]}
            </Text>
          )}
        </View>

      
        <TouchableOpacity
          onPress={pickImage}
          className="h-12 bg-blue-500 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-semibold">Pick Image</Text>
        </TouchableOpacity>

        {errors.image && (
          <Text className="text-red-500 text-sm">
            {errors.image[0]}
          </Text>
        )}

        {image && (
          <Image
            source={{ uri: image.uri }}
            className="h-48 w-full rounded-xl"
            resizeMode="cover"
          />
        )}

    
        <TouchableOpacity
          onPress={handleCreateBlog}
          disabled={loading}
          className={`h-12 rounded-xl items-center justify-center ${
            loading ? "bg-blue-300" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">
              Publish Blog
            </Text>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => router.navigate("/home")}>
          <Text className="text-blue-500 text-center mt-2">
            Back to home
          </Text>
        </Pressable>

      </View>
    </View>
  );
}