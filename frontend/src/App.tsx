import React, { useState, useEffect } from 'react';
import { Navbar, type TabType } from './components/Navbar';
import { CountrySelectorModal } from './components/CountrySelectorModal';
import { ShoppingHub } from './components/ShoppingHub';
import { DomainHub } from './components/DomainHub';
import { AIServicesHub } from './components/AIServicesHub';
import { CloudVPSHub } from './components/CloudVPSHub';
import { VPNSHub } from './components/VPNSHub';
import { GroceryBasketHub } from './components/GroceryBasketHub';
import { AlertsView } from './components/AlertsView';
import { type Country, fetchCountries, fetchAlerts } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('shopping');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const countryList = await fetchCountries();
      setCountries(countryList);

      // Check localStorage for saved country
      const savedCode = localStorage.getItem('smartdeals_country');
      if (savedCode) {
        const found = countryList.find((c) => c.code === savedCode);
        if (found) {
          setSelectedCountry(found);
        } else {
          setSelectedCountry(countryList[0]);
        }
      } else {
        // First visit: default to India (primary BuyHatke market) and open selector
        setSelectedCountry(countryList[0]);
        setIsCountryModalOpen(true);
      }

      refreshAlertsCount();
    } catch (err) {
      console.error('Failed to initialize app', err);
    }
  };

  const refreshAlertsCount = async () => {
    try {
      const alerts = await fetchAlerts();
      setActiveAlertsCount(alerts.filter((a: any) => !a.is_triggered).length);
    } catch (err) {
      console.error('Failed to load alert count', err);
    }
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem('smartdeals_country', country.code);
  };

  const currSymbol = selectedCountry?.currency_symbol || '₹';
  const currCode = selectedCountry?.currency || 'INR';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        selectedCountry={selectedCountry}
        onOpenCountryModal={() => setIsCountryModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'shopping' && (
          <ShoppingHub
            countryCode={selectedCountry?.code || 'IN'}
            currencySymbol={currSymbol}
            onAlertUpdated={refreshAlertsCount}
          />
        )}

        {activeTab === 'domains' && (
          <DomainHub
            currency={currCode}
            currencySymbol={currSymbol}
          />
        )}

        {activeTab === 'ai' && (
          <AIServicesHub
            currency={currCode}
            currencySymbol={currSymbol}
          />
        )}

        {activeTab === 'cloud' && (
          <CloudVPSHub
            currency={currCode}
            currencySymbol={currSymbol}
          />
        )}

        {activeTab === 'vpn' && (
          <VPNSHub />
        )}

        {activeTab === 'grocery' && (
          <GroceryBasketHub />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            currencySymbol={currSymbol}
          />
        )}
      </main>

      {/* Country Selection Onboarding Modal */}
      <CountrySelectorModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        countries={countries}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            SmartDeals Hub • Multi-Platform Price Intelligence & Automated Deal Alerts
          </p>
          <p>
            Supports Amazon, Flipkart, Croma, Cloudflare, Porkbun, Hetzner, Mullvad, Blinkit & more.
          </p>
          <p className="text-[11px] text-slate-600">
            © 2026 SmartDeals Hub. All brand trademarks belong to their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
