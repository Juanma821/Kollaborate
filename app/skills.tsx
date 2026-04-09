import { StyleSheet, Text, View } from 'react-native';

export default function Skills() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skills screen</Text>
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