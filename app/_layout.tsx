/**
 * SAFE TOUR — Root Layout (Expo Router)
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f7f9fb' }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="emergency/index" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="tourist-id/index" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="safety/anomaly-verification" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
