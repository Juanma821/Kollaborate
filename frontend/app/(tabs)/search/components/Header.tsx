import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = 'KOLLABORATE', showLogo = true }: HeaderProps) {
  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Ionicons name="logo-octocat" size={28} color="#ff743dff" />
          <Text style={styles.logoText}>{title}</Text>
        </View>
      )}
      {!showLogo && <Text style={styles.titleText}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },

  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
