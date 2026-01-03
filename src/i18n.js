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
import mlDocs from './locales/ml.json';
import paDocs from './locales/pa.json';
import orDocs from './locales/or.json';
import asDocs from './locales/as.json';
import urDocs from './locales/ur.json';
import neDocs from './locales/ne.json';
import kokDocs from './locales/kok.json';

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
      gu: { translation: guDocs },
      ml: { translation: mlDocs },
      pa: { translation: paDocs },
      or: { translation: orDocs },
      as: { translation: asDocs },
      ur: { translation: urDocs },
      ne: { translation: neDocs },
      kok: { translation: kokDocs }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
