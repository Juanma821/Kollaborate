import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
             headerTitle: "Busqueda",
             headerLeft: () => null,
             headerTitleAlign: 'center' }} />

        <Stack.Screen name="profileresult" options={{
             headerTitle: "Perfil",
             headerTitleAlign: 'center' }} />

    </Stack>
  );
}
