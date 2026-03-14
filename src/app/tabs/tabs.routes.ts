import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'explore',
        loadComponent: () =>
          import('../presentation/pages/explore/explore.page').then((m) => m.ExplorePage),
      },
      {
        path: 'live',
        loadComponent: () =>
          import('../presentation/pages/live/live.page').then((m) => m.LivePage),
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('../presentation/pages/progress/progress.page').then((m) => m.ProgressPage),
      },
      {
        path: '',
        redirectTo: '/tabs/explore',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/explore',
    pathMatch: 'full',
  },
];
