import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { useRouter } from "expo-router"; 

export default function SplashScreen() {
    const [fadeAnim] = useState(new Animated.Value(0)); 
    const router = useRouter();

    useEffect(() => {
        // Bắt đầu fade-in khi màn hình Splash được hiển thị
        Animated.timing(fadeAnim, {
            toValue: 1, // giá trị cuối cùng của opacity
            duration: 3000,
            useNativeDriver: true, 
        }).start();

        // Sau khi fade-in xong (3 giây), chuyển đến màn hình tiếp theo
        const timer = setTimeout(() => {
            router.replace("../app/(auth)/welcome"); 
        }, 2500);

        return () => clearTimeout(timer);
    }, [fadeAnim, router]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../../assets/images/flash.png")}
                style={[styles.image, { opacity: fadeAnim }]} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e8f3f2",
    },
    image: {
        width: 200,
        height: 200, 
        resizeMode: "contain", 
    },
});
