import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import en from './locales/en.json';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { I18nContext } from '@shopify/react-i18n';
import '@shopify/polaris/build/esm/styles.css';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

function I18nWrapper({ children }) {
  const i18n = {
    translate: (id) => en[id] || id,
  };
  return (
    <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
  );
}

root.render(
  <PolarisProvider i18n={{}}>
    <I18nWrapper>
      <App />
    </I18nWrapper>
  </PolarisProvider>
);
