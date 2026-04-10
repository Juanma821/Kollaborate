import { Stack } from "expo-router";

export default function MailboxLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
             headerTitle: "Buzon",
             headerLeft: () => null,
             headerTitleAlign: 'center' }} />

        <Stack.Screen name="mbnotify" options={{
             headerTitle: "Solicitud",
             headerTitleAlign: 'center' }} />

        <Stack.Screen name="mbchat" options={{
             headerTitle: "Chat",
             headerTitleAlign: 'center' }} />

    </Stack>
  );
}