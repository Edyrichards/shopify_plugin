import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBridgeProvider } from '@shopify/app-bridge-react';
import { Frame, Navigation } from '@shopify/polaris';
import Dashboard from './pages/Dashboard.jsx';
import Synonyms from './pages/Synonyms.jsx';
import Analytics from './pages/Analytics.jsx';
import Weights from './pages/Weights.jsx';

export default function App() {
  const appBridgeConfig = {
    apiKey: window.appConfig.apiKey,
    host: new URLSearchParams(location.search).get('host'),
    forceRedirect: true,
  };

  const navItems = [
    {url: '/', label: 'Dashboard', id: 'home'},
    {url: '/synonyms', label: 'Synonyms', id: 'synonyms'},
    {url: '/weights', label: 'Field Weights', id: 'weights'},
    {url: '/analytics', label: 'Analytics', id: 'analytics'},
  ];

  return (
    <AppBridgeProvider config={appBridgeConfig}>
      <BrowserRouter>
        <Frame
          navigation={<Navigation location={location.pathname} items={navItems.map(i => ({...i, label: <Link to={i.url}>{i.label}</Link>}))} />}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/synonyms" element={<Synonyms />} />
            <Route path="/weights" element={<Weights />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Frame>
      </BrowserRouter>
    </AppBridgeProvider>
  );
}
