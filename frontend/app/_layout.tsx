import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        <Stack.Screen name="recoverpass" options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '',       
          }} />
        <Stack.Screen name="verification" options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '',  
           }} />
        <Stack.Screen name="newpass" options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '', 
          }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
    </Stack>
  );
}
