import { Injectable } from '@angular/core';
import { EventService, IEvent } from '@c8y/client';
import { NOTE_EVENT_TYPE, Note, NoteLogEvent } from '../models/note-widget.model';

@Injectable()
export class NoteWidgetService {
  constructor(private eventService: EventService) {}

  async getCurrentNote(assetId: string): Promise<Note> {
    try {
      const events = (
        await this.eventService.list({
          source: assetId,
          pageSize: 1,
          type: NOTE_EVENT_TYPE,
        })
      ).data as NoteLogEvent[];

      if (!events || events.length === 0) {
        return undefined;
      }

      return events[0].c8y_NoteLogEvent;
    } catch (error) {
      console.error('Failed to load note log event');

      return undefined;
    }
  }

  async getNoteHistory(assetId: string): Promise<NoteLogEvent[]> {
    try {
      const events = (
        await this.eventService.list({
          source: assetId,
          pageSize: 2000,
          type: NOTE_EVENT_TYPE,
        })
      ).data as NoteLogEvent[];

      return events;
    } catch (error) {
      console.error('Failed to load note log events');

      return undefined;
    }
  }

  async createNoteLogEvent(assetId: string, note: Note): Promise<void> {
    const event: IEvent = {
      source: { id: assetId },
      text: 'Note updated',
      type: NOTE_EVENT_TYPE,
      [NOTE_EVENT_TYPE]: note,
      time: new Date().toISOString(),
    };

    await this.eventService.create(event);
  }
}
