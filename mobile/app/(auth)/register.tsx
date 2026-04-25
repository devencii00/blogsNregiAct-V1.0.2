import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function Register() {
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [profile_image, setProfileImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleRegistration = async () => {
    const newErrors: any = {};

    if (!name) newErrors.name = ["Name is required"];
    if (!email) newErrors.email = ["Email is required"];
    if (!password) newErrors.password = ["Password is required"];
    if (password !== password_confirmation)
      newErrors.password_confirmation = ["Passwords do not match"];
    if (!profile_image?.uri)
      newErrors.profile_image = ["Profile image is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation,
        profile_image,
      });

      setStatus("success");
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (e: any) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        Alert.alert("Error", "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">

         <Text className="text-[26px] font-extrabold text-[#1877f2] tracking-[-0.5px] text-center pb-5">
        Create account
      </Text>

 
 

      <View className="items-center mb-6">
        <TouchableOpacity
          onPress={pickImage}
          className="w-28 h-28 rounded-full bg-blue-600 items-center justify-center overflow-hidden"
        >
          {profile_image ? (
            <Image
              source={{ uri: profile_image.uri }}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-white text-xs text-center">
              Upload
            </Text>
          )}
        </TouchableOpacity>

        {errors.profile_image && (
          <Text className="text-red-500 text-sm mt-2">
            {errors.profile_image[0]}
          </Text>
        )}
      </View>


      <View className="gap-3">

        <View>
          <TextInput
            value={name}
            onChangeText={setName}
            className="h-12 px-4 border border-gray-300 rounded-xl"
            placeholder="Full name"
          />
          {errors.name && (
            <Text className="text-red-500 text-sm">
              {errors.name[0]}
            </Text>
          )}
        </View>

        <View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="h-12 px-4 border border-gray-300 rounded-xl"
            placeholder="Email"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 text-sm">
              {errors.email[0]}
            </Text>
          )}
        </View>

        <View>
          <TextInput
            value={password}
            onChangeText={setPassword}
            className="h-12 px-4 border border-gray-300 rounded-xl"
            placeholder="Password"
            secureTextEntry
          />
          {errors.password && (
            <Text className="text-red-500 text-sm">
              {errors.password[0]}
            </Text>
          )}
        </View>

        <View>
          <TextInput
            value={password_confirmation}
            onChangeText={setPasswordConfirmation}
            className="h-12 px-4 border border-gray-300 rounded-xl"
            placeholder="Confirm password"
            secureTextEntry
          />
          {errors.password_confirmation && (
            <Text className="text-red-500 text-sm">
              {errors.password_confirmation[0]}
            </Text>
          )}
        </View>
      </View>

{status === "success" && (
  <View className="bg-green-100 p-3 rounded-lg mb-4">
    <Text className="text-green-600 text-center font-bold">
      Account created successfully!
    </Text>
  </View>
)}
      <TouchableOpacity
        onPress={handleRegistration}
        disabled={loading}
        className={`h-12 rounded-xl items-center justify-center mt-6 ${loading ? "bg-blue-300" : "bg-blue-600"
          }`}
      >
        <Text className="text-white font-bold">
          {loading ? "Creating account..." : "Create account"}
        </Text>
      </TouchableOpacity>


      <Pressable onPress={() => router.navigate("/login")} className="mt-5">
        <Text className="text-blue-500 text-center">
          Back to Login
        </Text>
      </Pressable>

    </View>
  );
}