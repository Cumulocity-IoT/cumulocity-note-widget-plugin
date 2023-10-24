import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NoteWidgetService } from '../services/note-widget.service';
import {
  NOTE_EVENT_TYPE,
  Note,
  NoteLogEvent,
  WidgetDeviceConfig,
} from '../models/note-widget.model';
import { IUser, UserService } from '@c8y/client';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NoteWidgetLogsModalComponent } from './note-widget-logs-modal.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventRealtimeService } from '@c8y/ngx-components';

@Component({
  selector: 'c8y-note-widget',
  templateUrl: 'note-widget.component.html',
  styleUrls: ['note-widget.component.less'],
  providers: [NoteWidgetService, EventRealtimeService, BsModalService],
})
export class NoteWidgetComponent implements OnInit, OnDestroy {
  @Input() config: WidgetDeviceConfig;

  content: string;

  isContentChanged = false;

  note: Note;

  isAllowedToUpdateNote = false;

  private user: IUser;

  private subscription: Subscription;

  constructor(
    private noteWidgetService: NoteWidgetService,
    private userService: UserService,
    private modalService: BsModalService,
    private eventRealtimeService: EventRealtimeService
  ) {}

  async ngOnInit() {
    if (!this.config || !this.config.device) {
      throw new Error('Failed to init context');
    }

    this.user = (await this.userService.current()).data;

    await this.initNote();
    this.subscribeForNoteUpdates();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onContentUpdated(): void {
    this.updateIsContentChanged();
  }

  async onSaveButtonClicked(): Promise<void> {
    this.note = {
      content: this.content,
      author: this.user.email,
      date: new Date().toISOString(),
    };

    await this.noteWidgetService.createNoteLogEvent(this.config.device.id, this.note);

    this.updateIsContentChanged();
  }

  onResetButtonClicked(): void {
    this.content = this.note ? this.note.content : undefined;
    this.updateIsContentChanged();
  }

  onLogsButtonClicked(): void {
    this.modalService.show(NoteWidgetLogsModalComponent, {
      initialState: { assetId: this.config.device.id },
    });
  }

  private async initNote(): Promise<void> {
    this.note = await this.noteWidgetService.getCurrentNote(this.config.device.id);

    if (!this.note) {
      return;
    }

    this.content = this.note.content;
  }

  private subscribeForNoteUpdates(): void {
    this.subscription = this.eventRealtimeService
      .onCreate$(this.config.device.id)
      .pipe(filter((event) => event.type === NOTE_EVENT_TYPE))
      .subscribe((event) => {
        this.note = (event as NoteLogEvent).c8y_NoteLogEvent;
        this.content = this.note ? this.note.content : undefined;
        this.updateIsContentChanged();
      });
  }

  private updateIsContentChanged(): void {
    this.isContentChanged = (!this.note && !!this.content) || this.content !== this.note?.content;
  }
}
