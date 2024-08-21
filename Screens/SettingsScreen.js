import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../Components/AuthContext';
import PressableItem from '../Components/PressableItem';

export default function SettingsScreen() {
  const { language, setLanguage } = useContext(AuthContext);

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'zh' : 'en');
    console.log("current language setting is ", language);
  };

  return (
    <View style={styles.container}>
      <PressableItem onPress={toggleLanguage}>
        <Text style={styles.buttonText}>{`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}</Text>
      </PressableItem>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#f5f5f7',
    fontSize: 16,
  },
})
