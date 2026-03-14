import { Injectable } from '@angular/core';
import { Observable, of, interval, map, EMPTY } from 'rxjs';
import { MediaCapturePort } from '../../core/ports/media-capture.port';
import { MediaFrame } from '../../core/models/story-context.model';

@Injectable({
  providedIn: 'root'
})
export class MockMediaCaptureAdapter implements MediaCapturePort {
  initPreview(): void {
    console.warn('Mock initPreview: no-op');
  }

  /**
   * Generates a mock stream of "frames" every 2 seconds.
   */
  startCapture(): Observable<MediaFrame> {
    console.warn('Using Mock Media Capture Adapter');
    return interval(2000).pipe(
      map(i => ({
        base64Data: 'mock_frame_data_' + i,
        format: 'jpeg' as const,
        timestamp: Date.now()
      }))
    );
  }

  stopCapture(): void {
    console.log('Mock Capture Stopped.');
  }

  getStream(): Observable<MediaStream> {
    return EMPTY;
  }

  getAudioStream(): Observable<string> {
    return EMPTY;
  }
}
