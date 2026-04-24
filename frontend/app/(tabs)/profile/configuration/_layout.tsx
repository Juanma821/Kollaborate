import { Stack } from "expo-router";

export default function ConfigurationLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{        
           headerTitle: "Configuracion",
           headerTitleAlign: 'center',
           headerLeft: () => null }} />

        <Stack.Screen name="report" options={{
           headerTitle: "Reporte",
           headerTitleAlign: 'center' }} />
    </Stack>
  );
}
