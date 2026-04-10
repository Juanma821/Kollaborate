import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
           headerTitle: "Perfil",
           headerLeft: () => null }} />

        <Stack.Screen name="configuration" options={{
           headerTitle: "Configuracion" }} />

        <Stack.Screen name="skills" options={{
           headerTitle: "Habilidades" }} />

        <Stack.Screen name="editprofile" options={{
           headerTitle: "Editar Perfil" }} />

        <Stack.Screen name="statistics" options={{
           headerTitle: "Estadisticas" }} />

        <Stack.Screen name="record" options={{
           headerTitle: "Historial" }} />

        <Stack.Screen name="token" options={{
           headerTitle: "Token" }} />

    </Stack>
  );
}
