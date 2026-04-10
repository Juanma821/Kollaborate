import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Mailbox() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Buzon screen</Text>
      <Link href="/(tabs)/mailbox/mbnotify" style={styles.button}>Go to notification screen</Link>
      <Link href="/(tabs)/mailbox/mbchat" style={styles.button}>Go to chat screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
    button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});