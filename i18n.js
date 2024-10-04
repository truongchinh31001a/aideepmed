import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false, 
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Đường dẫn đến file JSON dịch
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // Không cần escape trong React
    },
    react: {
      useSuspense: false, // Tùy chọn theo nhu cầu của bạn
    },
  });

export default i18n;
