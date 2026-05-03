import { Stack } from "expo-router";
export default function ProfileLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
           headerTitle: "Perfil",
           headerTitleAlign: 'center',
           headerLeft: () => null }} />
        <Stack.Screen name="configuration" options={{
           headerShown: false,
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="skills" options={{
           headerTitle: "Habilidades",
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="editprofile" options={{
           headerTitle: "Editar Perfil",
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="statistics" options={{
           headerTitle: "Estadisticas",
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="record" options={{
           headerTitle: "Historial",
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="token" options={{
           headerTitle: "Token",
           headerTitleAlign: 'center' }} />
        <Stack.Screen name="translator" options={{
           headerTitle: "Traductor",
           headerTitleAlign: 'center' }} />
    </Stack>
  );
}
