import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="recoverpass" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        <Stack.Screen name="newpass" options={{ headerShown: false }} />

        <Stack.Screen name="profileresult" options={{ headerTitle: "Información" }} />

        <Stack.Screen name="mbnotify" options={{ headerTitle: "Solicitud" }} />
        <Stack.Screen name="mbchat" options={{ headerTitle: "Chat" }} />

        <Stack.Screen name="configuration" options={{ headerTitle: "Configuracion" }} />
        <Stack.Screen name="skills" options={{ headerTitle: "Habilidades" }} />
        <Stack.Screen name="editprofile" options={{ headerTitle: "Editar Perfil" }} />
        <Stack.Screen name="statistics" options={{ headerTitle: "Estadisticas" }} />
        <Stack.Screen name="record" options={{ headerTitle: "Historial" }} />
        <Stack.Screen name="token" options={{ headerTitle: "Token" }} />


        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
    </Stack>
  );
}
