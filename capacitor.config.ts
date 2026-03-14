import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cuentopia.liveagent',
  appName: 'CuentopIA',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: false
    }
  }
};

export default config;
