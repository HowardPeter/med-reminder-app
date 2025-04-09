import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="userSettings" options={{ headerShown: false }} />
      <Stack.Screen name="editYourProfile" options={{ headerShown: false }} />
      <Stack.Screen name="enterNewPassword" options={{ headerShown: false }} />
    </Stack>
  )
}