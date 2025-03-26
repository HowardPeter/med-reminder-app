import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Slot } from "expo-router";
import "../global.css"
import { View } from "react-native";
import { MenuProvider } from 'react-native-popup-menu';
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";


const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    if (isAuthenticated == false) {
      // redirect to signIn
      router.replace('/(auth)/signIn');
      // router.replace('/(auth)/signUp');
      // router.replace('/(auth)/welcome');
      // router.replace('/(auth)/forgotPassword');
    }
  }, [isAuthenticated]);

  return < Slot />
}

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>

  );
}