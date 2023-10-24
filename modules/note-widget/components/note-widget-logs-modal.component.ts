import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NoteLogEvent } from '../models/note-widget.model';
import { NoteWidgetService } from '../services/note-widget.service';

@Component({
  selector: 'c8y-note-widget-logs-modal',
  templateUrl: 'note-widget-logs-modal.component.html',
  styleUrls: ['note-widget-logs-modal.component.less'],
  providers: [NoteWidgetService],
})
export class NoteWidgetLogsModalComponent implements OnInit {
  @Input() assetId: string;

  isLoading = false;

  notes: NoteLogEvent[];

  constructor(protected bsModalRef: BsModalRef, private noteWidgetService: NoteWidgetService) {}

  async ngOnInit() {
    this.isLoading = true;
    this.notes = await this.noteWidgetService.getNoteHistory(this.assetId);
    this.isLoading = false;
  }
}
