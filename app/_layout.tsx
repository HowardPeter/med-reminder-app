import React, { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { Slot } from "expo-router";
import "../global.css"
import { MenuProvider } from 'react-native-popup-menu';
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";
import SplashScreen from "@/components/SplashScreenView";
import IntroScreenView from ".";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Giả lập thời gian hiển thị Splash

      setLoading(false); // Tắt SplashScreen sau khi kiểm tra

      if (typeof isAuthenticated === "undefined") return;

      if (isAuthenticated) {
        router.replace("/(auth)/welcome");
      } else {
        setShowIntro(true); // Hiển thị màn hình intro trước khi sign in
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return <SplashScreen />;
  }

  if (showIntro) {
    return <IntroScreenView onFinish={() => router.replace("/(auth)/signIn")} />;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>

  );
}