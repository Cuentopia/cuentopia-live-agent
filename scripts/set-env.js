const fs = require('fs');
const path = require('path');

// Cargar .env desde la raíz del proyecto
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const get = (key) => {
  const val = process.env[key];
  if (!val) {
    console.error(`❌ Variable de entorno requerida no encontrada: ${key}`);
    process.exit(1);
  }
  return val;
};

const envConfig = {
  projectId:         get('FIREBASE_PROJECT_ID'),
  appId:             get('FIREBASE_APP_ID'),
  storageBucket:     get('FIREBASE_STORAGE_BUCKET'),
  apiKey:            get('FIREBASE_API_KEY'),
  authDomain:        get('FIREBASE_AUTH_DOMAIN'),
  messagingSenderId: get('FIREBASE_MESSAGING_SENDER_ID'),
};

const devContent = `export const environment = {
  production: false,
  firebase: {
    projectId: '${envConfig.projectId}',
    appId: '${envConfig.appId}',
    storageBucket: '${envConfig.storageBucket}',
    apiKey: '${envConfig.apiKey}',
    authDomain: '${envConfig.authDomain}',
    messagingSenderId: '${envConfig.messagingSenderId}',
  }
};
`;

const prodContent = `export const environment = {
  production: true,
  firebase: {
    projectId: '${envConfig.projectId}',
    appId: '${envConfig.appId}',
    storageBucket: '${envConfig.storageBucket}',
    apiKey: '${envConfig.apiKey}',
    authDomain: '${envConfig.authDomain}',
    messagingSenderId: '${envConfig.messagingSenderId}',
  }
};
`;

const envDir = path.resolve(__dirname, '../src/environments');
fs.writeFileSync(path.join(envDir, 'environment.ts'), devContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodContent);

console.log('✅ Ficheros de environment generados correctamente.');
