import { Observable } from 'rxjs';
import { MediaFrame } from '../models/story-context.model';

export abstract class MediaCapturePort {
  abstract initPreview(): void;
  abstract startCapture(): Observable<MediaFrame>;
  abstract stopCapture(): void;
  abstract getStream(): Observable<MediaStream>;
  abstract getAudioStream(): Observable<string>;
}
