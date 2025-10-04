import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xoadvisor.app',
  appName: 'xo-advise-hub',
  webDir: 'dist',
  server: {
    url: 'https://789653ee-d967-4674-b933-9bdf4a91395a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
