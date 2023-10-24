import { IEvent } from '@c8y/client';

export const NOTE_EVENT_TYPE = 'c8y_NoteLogEvent';
export interface Note {
  content: string;
  author: string;
  date: string;
}
export interface NoteLogEvent extends IEvent {
  c8y_NoteLogEvent: Note;
}
export interface WidgetDeviceConfig {
  device: {
    id: string;
    name: string;
  };
}
