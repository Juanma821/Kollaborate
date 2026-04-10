import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
             headerTitle: "Busqueda",
             headerLeft: () => null }} />

        <Stack.Screen name="profileresult" options={{
             headerTitle: "Perfil" }} />

    </Stack>
  );
}
