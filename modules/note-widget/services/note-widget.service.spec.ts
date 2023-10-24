import { NoteWidgetService } from './note-widget.service';
import { CommonModule } from '@c8y/ngx-components';
import { TestBed } from '@angular/core/testing';
import { EventService } from '@c8y/client';
import { NOTE_EVENT_TYPE, Note } from '../models/note-widget.model';

describe('NoteWidgetService', () => {
  const EVENTS = [
    {
      creationTime: '2023-09-12T06:07:55.321Z',
      source: {
        name: 'Device A',
        id: '123456',
      },
      type: 'c8y_NoteLogEvent',
      lastUpdated: '2023-09-12T06:07:55.321Z',
      time: '2023-09-12T06:07:55.936Z',
      id: '94897427',
      text: 'Note updated',
      c8y_NoteLogEvent: {
        date: '2023-09-12T06:07:55.936Z',
        author: 'christian.guether@softwareag.com',
        content:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
    },
    {
      creationTime: '2023-09-12T06:07:23.846Z',
      source: {
        name: 'Device A',
        id: '123456',
      },
      type: 'c8y_NoteLogEvent',
      lastUpdated: '2023-09-12T06:07:23.846Z',
      time: '2023-09-12T06:07:24.428Z',
      id: '94897336',
      text: 'Note updated',
      c8y_NoteLogEvent: {
        date: '2023-09-12T06:07:24.428Z',
        author: 'christian.guether@softwareag.com',
        content:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
    },
    {
      creationTime: '2023-09-12T06:07:11.864Z',
      source: {
        name: 'Device A',
        id: '123456',
      },
      type: 'c8y_NoteLogEvent',
      lastUpdated: '2023-09-12T06:07:11.864Z',
      time: '2023-09-12T06:07:12.488Z',
      id: '94897297',
      text: 'Note updated',
      c8y_NoteLogEvent: {
        date: '2023-09-12T06:07:12.488Z',
        author: 'christian.guether@softwareag.com',
        content:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
    },
  ];

  let noteWidgetService: NoteWidgetService;

  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule.forRoot()],
      providers: [NoteWidgetService],
    });

    noteWidgetService = TestBed.inject(NoteWidgetService);
    eventService = TestBed.inject(EventService);
  });

  it('0.1 service should exist', () => {
    expect(noteWidgetService).toBeTruthy();
  });

  it('1.0 current note is returned correctly', async () => {
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'list').mockImplementation(() => {
      return new Promise((resolve) => resolve({ res: undefined, data: EVENTS }));
    });

    const note = await noteWidgetService.getCurrentNote(assetId);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith({
      source: assetId,
      pageSize: 1,
      type: NOTE_EVENT_TYPE,
    });
    expect(note).toBeDefined();
    expect(note).toEqual(EVENTS[0].c8y_NoteLogEvent);
  });

  it('1.1 if no note exists current note is undefined', async () => {
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'list').mockImplementation(() => {
      return new Promise((resolve) => resolve({ res: undefined, data: [] }));
    });

    const note = await noteWidgetService.getCurrentNote(assetId);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith({
      source: assetId,
      pageSize: 1,
      type: NOTE_EVENT_TYPE,
    });
    expect(note).toBeUndefined();
  });

  it('1.2 if error occurs loading the note, current note will be set to undefined', async () => {
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'list').mockRejectedValue('Some error');

    const note = await noteWidgetService.getCurrentNote(assetId);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith({
      source: assetId,
      pageSize: 1,
      type: NOTE_EVENT_TYPE,
    });
    expect(note).toBeUndefined();
  });

  it('2.0 note log history is returned correctly', async () => {
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'list').mockImplementation(() => {
      return new Promise((resolve) => resolve({ res: undefined, data: EVENTS }));
    });

    const notes = await noteWidgetService.getNoteHistory(assetId);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith({
      source: assetId,
      pageSize: 2000,
      type: NOTE_EVENT_TYPE,
    });
    expect(notes).toBeDefined();
    expect(notes).toEqual(EVENTS);
  });

  it('2.1 if error occurs loading notes log history is undefined', async () => {
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'list').mockRejectedValue('Some error');

    const notes = await noteWidgetService.getNoteHistory(assetId);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith({
      source: assetId,
      pageSize: 2000,
      type: NOTE_EVENT_TYPE,
    });
    expect(notes).toBeUndefined();
  });

  it('3.0 new note is created correctly', async () => {
    const note: Note = {
      content: 'Random content',
      author: 'john.doe@softwareag.com',
      date: new Date().toISOString(),
    };
    const assetId = 'Random';
    const eventServiceSpy = jest.spyOn(eventService, 'create').mockImplementation(() => {
      return new Promise((resolve) => resolve(undefined));
    });

    await noteWidgetService.createNoteLogEvent(assetId, note);

    expect(eventServiceSpy).toHaveBeenCalledTimes(1);
    expect(eventServiceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        source: { id: assetId },
        text: 'Note updated',
        type: NOTE_EVENT_TYPE,
        [NOTE_EVENT_TYPE]: note,
      })
    );
  });
});
