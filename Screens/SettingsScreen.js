import React, { useContext } from 'react';
import { View, Button } from 'react-native';
import { AuthContext } from '../Components/AuthContext'; 

const SettingsScreen = () => {
  const { language, setLanguage } = useContext(AuthContext);

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'zh' : 'en');
    console.log("current language setting is ",language);
  };

  return (
    <View>
      <Button title={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`} onPress={toggleLanguage} />
    </View>
  );
};

export default SettingsScreen;
