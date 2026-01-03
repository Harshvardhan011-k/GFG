import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enDocs from './locales/en.json';
import hiDocs from './locales/hi.json';
import bnDocs from './locales/bn.json';
import mrDocs from './locales/mr.json';
import taDocs from './locales/ta.json';
import teDocs from './locales/te.json';
import knDocs from './locales/kn.json';
import guDocs from './locales/gu.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enDocs },
      hi: { translation: hiDocs },
      bn: { translation: bnDocs },
      mr: { translation: mrDocs },
      ta: { translation: taDocs },
      te: { translation: teDocs },
      kn: { translation: knDocs },
      gu: { translation: guDocs }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
