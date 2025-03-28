import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Slot } from "expo-router";
import "../global.css"
import { MenuProvider } from 'react-native-popup-menu';
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    if (isAuthenticated == false) {
      // redirect to signIn
      router.replace('/(auth)/signUp');
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