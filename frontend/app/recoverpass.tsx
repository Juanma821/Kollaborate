import { StyleSheet, Text, View } from 'react-native';

export default function Recoverpass() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recover Password screen</Text>
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
});