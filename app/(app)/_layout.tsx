import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="homePage" options={{ headerShown: false }} />
      <Stack.Screen name="addPrescription" options={{ headerShown: false }} />
      <Stack.Screen name="addPills" options={{ headerShown: false }} />
      <Stack.Screen name="updatePrescription" options={{ headerShown: false }} />
      <Stack.Screen name="userSettings" options={{ headerShown: false }} />
      <Stack.Screen name="editYourProfile" options={{ headerShown: false }} />
      <Stack.Screen name="enterNewPassword" options={{ headerShown: false }} />
      <Stack.Screen name="activePrescriptions" options={{ headerShown: false }} />
      <Stack.Screen name="consultingDoctors" options={{ headerShown: false }} />
      <Stack.Screen name="updateDoctor" options={{ headerShown: false }} />
      <Stack.Screen name="addDoctor" options={{ headerShown: false }} />
    </Stack>
  );
}

  