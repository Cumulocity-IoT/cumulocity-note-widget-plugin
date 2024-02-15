import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoteWidgetComponent } from './note-widget.component';
import { NoteWidgetService } from '../services/note-widget.service';
import { IResult, IUser, UserService } from '@c8y/client';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CoreModule, EventRealtimeService } from '@c8y/ngx-components';
import { CommonModule } from '@angular/common';
import { Note, WidgetDeviceConfig } from '../models/note-widget.model';

describe('NoteWidgetComponent', () => {
  const config: WidgetDeviceConfig = {
    device: {
      id: '123',
      name: 'testDevice',
    },
  };

  const user: IUser = {
    userName: 'test',
    displayName: 'test',
    email: 'test@softwareag.com',
  };

  let component: NoteWidgetComponent;

  let fixture: ComponentFixture<NoteWidgetComponent>;

  let userServiceMock = {
    current: jest.fn().mockResolvedValue({
      data: user,
    } as IResult<IUser>),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CoreModule.forRoot()],
      declarations: [NoteWidgetComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    })
      .overrideComponent(NoteWidgetComponent, {
        set: {
          providers: [
            { provide: NoteWidgetService },
            { provide: BsModalService },
            { provide: EventRealtimeService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NoteWidgetComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should init component correctly', async () => {
      const note: Note = {
        content: 'Some content',
        author: 'test',
        date: '2021-06-01T12:00:00Z',
      };

      const noteWidgetService = fixture.debugElement.injector.get(NoteWidgetService);
      const eventRealtimeService = fixture.debugElement.injector.get(EventRealtimeService);
      const noteWidgetServiceSpy = jest
        .spyOn(noteWidgetService, 'getCurrentNote')
        .mockResolvedValue(note);
      const eventRealtimeServiceSpy = jest.spyOn(eventRealtimeService, 'onCreate$');

      component.config = config;

      await component.ngOnInit();

      expect(component.note).toEqual(note);
      expect(noteWidgetServiceSpy).toHaveBeenCalledTimes(1);
      expect(noteWidgetServiceSpy).toHaveBeenCalledWith(config.device.id);
      expect(userServiceMock.current).toHaveBeenCalledTimes(1);
      expect(eventRealtimeServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentUpdated', () => {
    it('should set isContentChanged to true if content has been changed and note is null', () => {
      component.content = 'New content';

      component.onContentUpdated();

      expect(component.isContentChanged).toBeTruthy();
    });

    it('should set isContentChanged to false if content has not been changed and note is null', () => {
      component.onContentUpdated();

      expect(component.isContentChanged).toBeFalsy();
    });

    it('should set isContentChanged to true if content has been changed and content of note is not null', () => {
      const note: Note = {
        content: 'Some content',
        author: 'test',
        date: '2021-06-01T12:00:00Z',
      };
      const content = 'Updated content';

      component.note = note;
      component.content = content;

      component.onContentUpdated();

      expect(component.isContentChanged).toBeTruthy();
    });

    it('should set isContentChanged to false if content is equal to content of note', () => {
      const note: Note = {
        content: 'Some content',
        author: 'test',
        date: '2021-06-01T12:00:00Z',
      };
      const content = 'Some content';

      component.note = note;
      component.content = content;

      component.onContentUpdated();

      expect(component.isContentChanged).toBeFalsy();
    });
  });

  describe('reset button', () => {
    it('reset button should be disabled if content has not been changed', () => {
      component.isContentChanged = false;

      fixture.detectChanges();

      const resetButton = fixture.nativeElement.querySelector(
        `[data-cy='note-widget-button-reset']`
      );

      expect(resetButton.disabled).toBeTruthy();
    });

    it('reset button should be enabled if content has been changed', () => {
      component.isContentChanged = true;

      fixture.detectChanges();

      const resetButton = fixture.nativeElement.querySelector(
        `[data-cy='note-widget-button-reset']`
      );

      expect(resetButton.disabled).toBeFalsy();
    });

    it('should reset content to note content if note is set and reset button is clicked', () => {
      const note: Note = {
        content: 'Some content',
        author: 'test',
        date: '2021-06-01T12:00:00Z',
      };
      const content = 'Random content';
      const resetButton = fixture.nativeElement.querySelector(
        `[data-cy='note-widget-button-reset']`
      );
      const resetButtonCallbackSpy = jest.spyOn(component, 'onResetButtonClicked');

      component.note = note;
      component.content = content;
      component.isContentChanged = true;

      fixture.detectChanges();

      expect(resetButton.disabled).toBeFalsy();

      resetButton.click();

      fixture.detectChanges();

      expect(resetButtonCallbackSpy).toHaveBeenCalledTimes(1);
      expect(component.content).toEqual('Some content');
      expect(component.isContentChanged).toBeFalsy();
      expect(resetButton.disabled).toBeTruthy();
    });

    it('should reset content to undefined if note is not set and reset button is clicked', () => {
      const content = 'Random content';
      const resetButton = fixture.nativeElement.querySelector(
        `[data-cy='note-widget-button-reset']`
      );
      const resetButtonCallbackSpy = jest.spyOn(component, 'onResetButtonClicked');

      component.content = content;
      component.isContentChanged = true;

      fixture.detectChanges();

      resetButton.click();

      fixture.detectChanges();

      expect(resetButtonCallbackSpy).toHaveBeenCalledTimes(1);
      expect(component.content).toBeUndefined();
      expect(component.isContentChanged).toBeFalsy();
    });
  });

  describe('onSaveButtonClicked', () => {
    it('should create note log event and update isContentChanged', async () => {
      const content = 'Random content';
      const noteWidgetService = fixture.debugElement.injector.get(NoteWidgetService);
      const noteWidgetServiceSpy = jest
        .spyOn(noteWidgetService, 'createNoteLogEvent')
        .mockImplementation(() => Promise.resolve());
      const saveButtonCallbackSpy = jest.spyOn(component, 'onSaveButtonClicked');
      const saveButton = fixture.nativeElement.querySelector(`[data-cy='note-widget-button-save']`);

      jest
        .spyOn(noteWidgetService, 'getCurrentNote')
        .mockImplementation(() => Promise.resolve(null));

      component.config = config;
      component['user'] = user;
      component.content = content;
      component.isContentChanged = true;

      fixture.detectChanges();

      saveButton.click();
      await fixture.whenStable();

      fixture.detectChanges();

      expect(saveButtonCallbackSpy).toHaveBeenCalledTimes(1);
      expect(noteWidgetServiceSpy).toHaveBeenCalledTimes(1);
      expect(noteWidgetServiceSpy).toHaveBeenCalledWith(config.device.id, {
        content,
        author: user.email,
        date: expect.any(String),
      });
      expect(component.isContentChanged).toBeFalsy();
    });
  });

  describe('onLogsButtonClicked', () => {
    it('should open modal to display note logs', () => {
      const note: Note = {
        content: 'Some content',
        author: 'test',
        date: '2021-06-01T12:00:00Z',
      };

      const noteWidgetService = fixture.debugElement.injector.get(NoteWidgetService);
      const modalService = fixture.debugElement.injector.get(BsModalService);
      const modalServiceSpy = jest.spyOn(modalService, 'show').mockImplementationOnce(() => {
        return null;
      });
      const logsButton = fixture.nativeElement.querySelector(`[data-cy='note-widget-button-logs']`);
      const logsButtonCallbackSpy = jest.spyOn(component, 'onLogsButtonClicked');

      jest
        .spyOn(noteWidgetService, 'getCurrentNote')
        .mockImplementation(() => Promise.resolve(note));

      component.note = note;
      component.config = config;

      fixture.detectChanges();

      expect(logsButton.disabled).toBeFalsy();
      logsButton.click();

      expect(logsButtonCallbackSpy).toHaveBeenCalledTimes(1);
      expect(modalServiceSpy).toHaveBeenCalledTimes(1);
      expect(modalServiceSpy).toHaveBeenCalledWith(expect.any(Function), {
        initialState: { assetId: config.device.id },
      });
    });
  });
});
