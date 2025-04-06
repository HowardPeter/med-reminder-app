import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { Slot } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "@/hooks/useAuth";
import StartPage from "./index"; // Import Splash Screen

const MainLayout = () => {
  const { verified, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chạy Splash Screen trong 3 giây
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(app)";
    if (verified && !inApp) {
      router.replace("/(app)/homePage");
    } else if (!isAuthenticated) {
      router.replace("/(app)/homePage");
    }
  }, [isAuthenticated, verified, isLoading]);

  if (isLoading) return <StartPage />; // Hiển thị Splash Screen trước khi điều hướng

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