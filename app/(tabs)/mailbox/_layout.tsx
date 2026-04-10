import { Stack } from "expo-router";

export default function MailboxLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
             headerTitle: "Buzon",
             headerLeft: () => null }} />

        <Stack.Screen name="mbnotify" options={{
             headerTitle: "Solicitud" }} />

        <Stack.Screen name="mbchat" options={{
             headerTitle: "Chat" }} />

    </Stack>
  );
}