import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonIcon,
  IonText, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, query, where, CollectionReference } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { addIcons } from 'ionicons';
import { moon, school, people, bed, rocket } from 'ionicons/icons';

interface StoryTheme {
  id: string;
  agentId: string;
  title: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
  order: number;
}

@Component({
  selector: 'app-explore',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>¿Qué vamos a superar hoy?</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Explorar Temas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-text color="medium">
        <p class="ion-padding-horizontal">Selecciona un reto emocional para que el narrador ayude a tu pequeño.</p>
      </ion-text>

      @if (topics() === undefined) {
        <div class="ion-text-center ion-padding-top">
          <ion-spinner name="dots" color="primary"></ion-spinner>
        </div>
      } @else {
        <ion-grid>
          <ion-row>
            @for (topic of topics(); track topic.id) {
              <ion-col size="12" size-md="6">
                <ion-card (click)="selectTopic(topic)" button="true">
                  <ion-card-header>
                    <div class="topic-header">
                      <ion-icon [name]="topic.icon" color="primary" style="font-size: 32px;"></ion-icon>
                      <ion-card-title>{{ topic.title }}</ion-card-title>
                    </div>
                    <ion-card-subtitle>{{ topic.subtitle }}</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>
      }
    </ion-content>
  `,
  styles: [`
    .topic-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
  `],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonIcon,
    IonText, IonSpinner
  ]
})
export class ExplorePage {
  private readonly router = inject(Router);
  private readonly firestore = inject(Firestore);

  private readonly themes$ = collectionData<StoryTheme>(
    query(
      collection(this.firestore, 'storyThemes') as CollectionReference<StoryTheme>,
      where('enabled', '==', true)
    ),
    { idField: 'id' }
  ).pipe(map(themes => [...themes].sort((a, b) => a.order - b.order)));

  readonly topics = toSignal(this.themes$);

  constructor() {
    addIcons({ moon, school, people, bed, rocket });
  }

  selectTopic(topic: StoryTheme): void {
    this.router.navigate(['/tabs/live'], {
      queryParams: { topic: topic.title, agentId: topic.agentId }
    });
  }
}
