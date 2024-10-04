// LanguageSwitcher.js
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';
import { useEffect, useState } from 'react';
import i18n from 'i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');

  const toggleLanguage = (checked) => {
    const newLanguage = checked ? 'vi' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  useEffect(() => {
    const currentLang = i18n.language || window.localStorage.getItem('i18nextLng') || 'en';
    setLanguage(currentLang);
  }, [i18n.language]);

  return (
    <Switch
      checkedChildren="VI"
      unCheckedChildren="EN"
      onChange={toggleLanguage}
      checked={language === 'vi'}
    />
  );
};

export default LanguageSwitcher;
