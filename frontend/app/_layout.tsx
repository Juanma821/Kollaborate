import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from './_utils/authStorage';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getToken();

        const isAuthScreen =
          pathname === '/login' ||
          pathname === '/signup' ||
          pathname === '/recoverpass' ||
          pathname === '/verification' ||
          pathname === '/newpass';

        if (token && isAuthScreen) {
          router.replace('/(tabs)/home');
          return;
        }

        if (!token && !isAuthScreen) {
          router.replace('/login');
          return;
        }
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  if (checkingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff743d" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />

      <Stack.Screen
        name="recoverpass"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="newpass"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitle: '',
        }}
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

