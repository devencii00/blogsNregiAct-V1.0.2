import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from "@/api/axios";

type BlogProps = {
  id: number;
  title: string;
  image: string;
  description: string;
};

export default function Home() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);

  const getBlogs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/fetchBlogs"
      );
      setBlogs(response.data);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBlogs();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">

      
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-extrabold text-[#1877f2]">
            Feed
          </Text>

          <Pressable
            onPress={() =>
              router.navigate("/(default)/(pages)/home/create")
            }
            className="bg-blue-600 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">Create</Text>
          </Pressable>
        </View>

     
        <View className="gap-4">
          {blogs.map((blog) => (
            <View
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md"
            >
              <Image
                className="h-48 w-full"
                source={{
                  uri: `http://127.0.0.1:8000/storage/${blog.image}`,
                }}
                resizeMode="cover"
              />

              <View className="p-3 gap-2">
                <Text className="text-lg font-bold text-gray-800">
                  {blog.title}
                </Text>

                <Text
                  numberOfLines={3}
                  className="text-gray-600"
                >
                  {blog.description}
                </Text>

                <Pressable>
                  <Text className="text-blue-500 mt-1">
                    
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}