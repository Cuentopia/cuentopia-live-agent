import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideAuth, getAuth, signInAnonymously } from '@angular/fire/auth';
import { environment } from './environments/environment';

// Core Ports & Adapters
import { StorytellingPort } from './app/core/ports/storytelling.port';
import { MediaCapturePort } from './app/core/ports/media-capture.port';
import { SessionPort } from './app/core/ports/session.port';
import { FirebaseStorytellingAdapter } from './app/infrastructure/adapters/firebase-storytelling.adapter';
import { IonicMediaAdapter } from './app/infrastructure/adapters/ionic-media.adapter';
import { FirestoreSessionAdapter } from './app/infrastructure/adapters/firestore-session.adapter';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // --- FIREBASE PROVIDERS ---
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      signInAnonymously(auth).catch(err => console.error('Auth error:', err));
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (!environment.production) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (!environment.production) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),

    // --- HEXAGONAL DI ---
    { provide: StorytellingPort, useClass: FirebaseStorytellingAdapter },
    { provide: MediaCapturePort, useClass: IonicMediaAdapter },
    { provide: SessionPort, useClass: FirestoreSessionAdapter }
  ],
}).catch((err) => console.error(err));
