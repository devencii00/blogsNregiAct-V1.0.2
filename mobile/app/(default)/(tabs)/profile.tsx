import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Profile() {
  const { logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    setShowModal(false);
    await logout();
  };

  return (
    <View className="flex-1 bg-white p-6">

    
      <View className="items-center mt-10 mb-8">
        <Image
          className="h-28 w-28 rounded-full"
          source={{
            uri: `http://127.0.0.1:8000/storage/${user?.profile_image}`,
          }}
        />
      </View>

      <View className="gap-4">
        <View>
          <Text className="text-gray-500">Name</Text>
          <Text className="text-lg font-semibold text-black">
            {user?.name}
          </Text>
        </View>

        <View>
          <Text className="text-gray-500">Email</Text>
          <Text className="text-lg font-semibold text-black">
            {user?.email}
          </Text>
        </View>
      </View>

    
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="mt-10 h-12 bg-red-500 rounded-xl items-center justify-center"
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>

  
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">

          <View className="bg-white w-80 p-5 rounded-2xl">

            <Text className="text-lg font-bold text-center mb-2">
              Confirm Logout
            </Text>

            <Text className="text-gray-500 text-center mb-6">
              Are you sure you want to log out of your account?
            </Text>

            <View className="flex-row justify-between">

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="flex-1 mr-2 h-11 bg-gray-200 rounded-xl items-center justify-center"
              >
                <Text className="font-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-1 ml-2 h-11 bg-red-500 rounded-xl items-center justify-center"
              >
                <Text className="font-semibold text-white">
                  Logout
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
}