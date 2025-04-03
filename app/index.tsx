import theme from "@/config/theme";
import { images } from "@/constants";
import { useEffect, useState } from "react";
import { Animated, View, Text } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function StartPage() {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Bắt đầu hiệu ứng fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
    });
  }, []);

  return (
    <View
      style={{ backgroundColor: theme.colors.primary }}
      className="w-full flex-1 justify-center items-center"
    >
      <Animated.Image
        source={images.splashImage}
        style={{
          width: 350,
          height: 350,
          resizeMode: "contain",
          opacity: fadeAnim,
        }}
      />
      <Animated.Text style={{ opacity: fadeAnim }}>
        <Text style={{ fontSize: hp(4) }} className='text-white font-bold text-center'>Manage your pill schedule easier than ever</Text>
      </Animated.Text>
    </View>
  );
}