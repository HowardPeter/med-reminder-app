import React, { ReactNode } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface CustomKeyboardViewProps {
  children: ReactNode;
  inChat: boolean;
}

const CustomKeyboardView: React.FC<CustomKeyboardViewProps> = ({ children, inChat }) => {
  let kavConfig = {};
  let scrollViewConfig = {};
  if (inChat) {
    kavConfig = { keyboardVerticalOffset: 90 };
    scrollViewConfig = { contenContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      {...kavConfig}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        {...scrollViewConfig}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;