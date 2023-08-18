import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ch.rondo.songbookapp',
  appName: 'songbook-app',
  webDir: 'dist',
  backgroundColor: "#000000",
  server: {
    androidScheme: 'https'
  }
};

export default config;
