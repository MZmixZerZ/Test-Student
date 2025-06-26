import { Directive, HostListener, HostBinding, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDrag]',
  standalone: true
})
export class DragDirective {
  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f9f9f9';

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#e8e8e8';
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f9f9f9';
  }

  // Drop listener
  @HostListener('drop', ['$event']) onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f9f9f9';

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
