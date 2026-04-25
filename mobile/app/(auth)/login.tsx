import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { router } from "expo-router";

export default function Login() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [formError, setFormError] = useState("");

  const handleLogin = async () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = ["Email is required"];
    if (!password) newErrors.password = ["Password is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.replace("/(default)/(tabs)/home");
    } catch (error: any) {
      if (error.response?.status === 422 || error.response?.status === 401) {
        setFormError("Invalid email or password");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">

      <Text className="text-2xl font-bold mb-8 text-gray-800">
        Log in to you account
      </Text>

    
      <View className="mb-4">
        <Text className="text-gray-500 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="h-12 px-4 border border-gray-300 rounded-xl"
          placeholder="Enter your email"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.email[0]}
          </Text>
        )}
      </View>

   
      <View className="mb-2">
        <Text className="text-gray-500 mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          className="h-12 px-4 border border-gray-300 rounded-xl"
          placeholder="Enter your password"
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.password[0]}
          </Text>
        )}
      </View>


      {formError !== "" && (
        <Text className="text-red-500 text-center mt-3">
          {formError}
        </Text>
      )}

   
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`h-12 rounded-xl items-center justify-center mt-6 ${
          loading ? "bg-blue-300" : "bg-blue-600"
        }`}
      >
        <Text className="text-white font-bold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

   
      <Pressable
        onPress={() => router.navigate("/register")}
        className="mt-5"
      >
        <Text className="text-blue-500 text-center">
         Create an account
        </Text>
      </Pressable>

    </View>
  );
}