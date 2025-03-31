import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { Slot } from "expo-router";
import "../global.css"
import { MenuProvider } from 'react-native-popup-menu';
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] === '(app)';
    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace('../(app)/home');
    }
    else if (!isAuthenticated) {
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