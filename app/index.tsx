import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface IntroScreenViewProps {
  onFinish: () => void;
}

const IntroScreenView: React.FC<IntroScreenViewProps> = ({ onFinish }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the App</Text>
      <TouchableOpacity onPress={onFinish}>
        <Text style={{ fontSize: 18, color: '#04A996' }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IntroScreenView;