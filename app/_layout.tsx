import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { Slot } from "expo-router";
import "../global.css"
import { MenuProvider } from 'react-native-popup-menu';
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";

const MainLayout = () => {
  const { verified, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] === '(app)';
    if (verified && !inApp) {
      // redirect to home
      router.replace('../(app)/home');
    }
    else if (!isAuthenticated) {
      // redirect to signIn
      router.replace('/(auth)/signIn');
    }
  }, [isAuthenticated, verified]);
  console.log("Is authenticated: ", isAuthenticated)
  console.log("Is verifed: ", verified)

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