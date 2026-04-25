import axios from "@/api/axios";
import { setToken } from "@/services/auth-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";
import { ImagePickerAsset } from 'expo-image-picker';
interface User {
  name: string;
  email: string;
  profile_image: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  getUser: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  register: (data:RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData{
  name:string;
  email:string;
  password:string;
  password_confirmation:string;
  profile_image: ImagePickerAsset | string | null; 
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,

  getUser: async () => {
    try {
      const { data } = await axios.get("/user");
      set({ user: data });
    } catch (error) {
      console.log(error);
    }
  },

login: async (data) => {
  try {
    const response = await axios.post("/login", data);
    await setToken(response.data.token);
    await get().getUser();
    router.replace("/(default)/(tabs)/home"); 
  } catch (error: any) {
    
    throw error;
  }
},

register: async (data) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    if (data.profile_image) {
      const uri =
        typeof data.profile_image === "string"
          ? data.profile_image
          : data.profile_image.uri;

      const response = await fetch(uri);
      const blob = await response.blob();

      formData.append("profile_image", blob, "profile.jpg");
    }

    const res = await axios.post("/register", formData);

    return res.data;

  } catch (error: any) {
    console.log("REGISTER ERROR:", error.response?.data);
    throw error;
  }
},

  logout: async () => {
    try {
      await axios.post("/logout");
      await setToken(null);
      set({ user: null });
    } catch (error) {
      console.log(error);
    }
  },
}));
