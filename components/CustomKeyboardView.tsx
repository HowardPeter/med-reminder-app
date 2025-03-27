import React, { ReactNode } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface CustomKeyboardViewProps {
  children: ReactNode;
}

const CustomKeyboardView: React.FC<CustomKeyboardViewProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;