import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoteWidgetLogsModalComponent } from './note-widget-logs-modal.component';
import { CoreModule } from '@c8y/ngx-components';
import { NoteWidgetService } from '../services/note-widget.service';
import { NoteLogEvent } from '../models/note-widget.model';
import { CommonModule } from '@angular/common';

describe('NoteWidgetLogsModalComponent', () => {
  let component: NoteWidgetLogsModalComponent;

  let fixture: ComponentFixture<NoteWidgetLogsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CoreModule.forRoot()],
      declarations: [NoteWidgetLogsModalComponent],
    })
      .overrideComponent(NoteWidgetLogsModalComponent, {
        set: {
          providers: [NoteWidgetService],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NoteWidgetLogsModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all notes on init', fakeAsync(() => {
    const assetId = '123';
    const notes: NoteLogEvent[] = [
      {
        id: '1',
        type: 'c8y_NoteLogEvent',
        text: 'Note 1',
        time: new Date().toISOString(),
        source: {
          id: assetId,
        },
        c8y_NoteLogEvent: {
          content: 'Note 1',
          author: 'test',
          date: new Date().toISOString(),
        },
      },
      {
        id: '2',
        type: 'c8y_NoteLogEvent',
        text: 'Note 2',
        time: new Date().toISOString(),
        source: {
          id: assetId,
        },
        c8y_NoteLogEvent: {
          content: 'Note 2',
          author: 'test2',
          date: new Date().toISOString(),
        },
      },
    ];

    const noteWidgetService = fixture.debugElement.injector.get(NoteWidgetService);
    const getNoteHistorySpy = jest
      .spyOn(noteWidgetService, 'getNoteHistory')
      .mockImplementation(() => Promise.resolve(notes));

    component.assetId = assetId;

    // fixture.detectChanges() triggers ngOnInit
    fixture.detectChanges();

    // check if loading is set to true while fetching notes
    expect(component.isLoading).toBe(true);

    tick();

    fixture.detectChanges();

    const logsListElement = fixture.nativeElement.querySelector(`[data-cy="notes-logs-list"]`);

    expect(logsListElement).toBeTruthy();

    expect(component.isLoading).toBe(false);
    expect(component.notes).toEqual(notes);
    expect(getNoteHistorySpy).toHaveBeenCalledWith(assetId);
    expect(getNoteHistorySpy).toHaveBeenCalledTimes(1);
  }));

  it('should display empty state if notes are empty', fakeAsync(() => {
    const assetId = '123';
    const notes: NoteLogEvent[] = [];

    const noteWidgetService = fixture.debugElement.injector.get(NoteWidgetService);
    const getNoteHistorySpy = jest
      .spyOn(noteWidgetService, 'getNoteHistory')
      .mockImplementation(() => Promise.resolve(notes));

    component.assetId = assetId;

    // fixture.detectChanges() triggers ngOnInit
    fixture.detectChanges();

    // check if loading is set to true while fetching notes
    expect(component.isLoading).toBe(true);

    tick();

    fixture.detectChanges();

    const logsListElement = fixture.nativeElement.querySelector(
      `[data-cy="notes-logs-list-empty"]`
    );

    expect(logsListElement).toBeTruthy();

    expect(component.isLoading).toBe(false);
    expect(component.notes).toEqual(notes);
    expect(getNoteHistorySpy).toHaveBeenCalledTimes(1);
    expect(getNoteHistorySpy).toHaveBeenCalledWith(assetId);
  }));
});
