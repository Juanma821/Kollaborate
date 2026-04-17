import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: '#ff743dff',}}>
        <Tabs.Screen name="classroom" options={{
           headerTitle: "Salon de clases",
           headerTitleAlign: 'center',
           title: 'Salon', 
           tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'easel-sharp' : 'easel-outline'} color={color} size={24} />),   }} />

        <Tabs.Screen name="search" listeners={({ navigation }) => ({
           tabPress: (e) => {navigation.navigate('search', { screen: 'index' });},})} options={{
           headerShown: false, 
           title: 'Busqueda', 
           tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />),   }} />

        <Tabs.Screen name="home" options={{
           headerTitle: "Kollaborate",
           headerTitleAlign: 'center', 
           title: 'Inicio', 
           tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />),  }} />

        <Tabs.Screen name="mailbox" listeners={({ navigation }) => ({
           tabPress: (e) => {navigation.navigate('mailbox', { screen: 'index' });},})} options={{
           headerShown: false, 
           title: 'Buzon', 
           tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'chatbubbles-sharp' : 'chatbubbles-outline'} color={color} size={24} />),   }} />

        <Tabs.Screen name="profile" listeners={({ navigation }) => ({
          tabPress: (e) => {navigation.navigate('profile', { screen: 'index' });},})} options={{
           headerShown: false, 
           title: 'Perfil', 
           tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />),   }} />

    </Tabs>
  );
}
