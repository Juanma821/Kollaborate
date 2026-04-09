import { StyleSheet, Text, View } from 'react-native';

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Profile screen</Text>
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