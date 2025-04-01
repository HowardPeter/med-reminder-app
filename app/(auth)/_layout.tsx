import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="emailVerified" options={{ headerShown: false }} />
        <Stack.Screen name="otpVerified" options={{ headerShown: false }} />
        <Stack.Screen name="enterNewPassword" options={{ headerShown: false }} />
    </Stack>
  )
}