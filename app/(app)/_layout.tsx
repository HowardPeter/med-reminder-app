import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="homePage" options={{ headerShown: false }} />
      <Stack.Screen name="addPrescription" options={{ headerShown: false }} />
      <Stack.Screen name="addPills" options={{ headerShown: false }} />
      <Stack.Screen name="updatePrescription" options={{ headerShown: false }} />
    </Stack>
  )
}