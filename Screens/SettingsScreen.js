import React, { useContext } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../Components/AuthContext';
import PressableItem from '../Components/PressableItem';

export default function SettingsScreen() {
  const { language, setLanguage } = useContext(AuthContext);

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'zh' : 'en');
    console.log("current language setting is ", language);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>{language === 'en' ? 'Language:English' : '语言:中文'} </Text>
        <PressableItem onPress={toggleLanguage}>
          <Text style={styles.buttonText}>{language === 'en' ? '切换至中文' : 'Switch to English'}</Text>
        </PressableItem>
      </View>
      {/* Future settings can be added here in additional <View> components */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  settingItem: {
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor: '#f0f0f0', 
    borderRadius: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#d1d1d1',
    paddingHorizontal:10,
  },
  buttonText: {
    color: '#f5f5f7',
    fontSize: 16,
  },
  settingText:{
    fontSize: 16,
  }
})
