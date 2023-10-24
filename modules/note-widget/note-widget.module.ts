import { NgModule } from '@angular/core';
import { NoteWidgetComponent } from './components/note-widget.component';
import { CoreModule, HOOK_COMPONENTS, hookComponent } from '@c8y/ngx-components';
import { CommonModule } from '@angular/common';
import { NoteWidgetLogsModalComponent } from './components/note-widget-logs-modal.component';

@NgModule({
  imports: [CoreModule, CommonModule],
  exports: [],
  declarations: [NoteWidgetComponent, NoteWidgetLogsModalComponent],
  providers: [
    hookComponent({
      id: 'c8y.note.widget',
      label: 'Note Widget',
      description: '',
      component: NoteWidgetComponent,
      data: {
        settings: {
          noNewWidgets: false,
          ng1: {
            options: {
              noDeviceTarget: false,
              groupsSelectable: true,
            },
          },
        },
      },
    }),
  ],
})
export class NoteWidgetModule {}
