import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: '#ff743dff',}}>
        <Tabs.Screen name="classroom" options={{ headerTitle: "Salon de clases",title: 'Salon', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'easel-sharp' : 'easel-outline'} color={color} size={24} />),   }} />
        <Tabs.Screen name="search" options={{ headerTitle: "Busqueda", title: 'Busqueda', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />),   }} />
        <Tabs.Screen name="home" options={{ headerTitle: "Kollaborate", title: 'Inicio', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />),  }} />
        <Tabs.Screen name="mailbox" options={{ headerTitle: "Buzon", title: 'Buzon', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'chatbubbles-sharp' : 'chatbubbles-outline'} color={color} size={24} />),   }} />
        <Tabs.Screen name="profile" options={{ headerTitle: "Perfil", title: 'Perfil', tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />),   }} />

    </Tabs>
  );
}
