import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    standalone: true,
    imports: [NgIf],
})
export class GalleryComponent {
    @Input() images: string[] = [];
    @Input() currentIndex: number = 0;
    @Input() isOpen: boolean = false;
    @Output() close = new EventEmitter<void>();

    closeGallery() {
        this.isOpen = false;
        this.images = [];
        this.currentIndex = 0;
        this.close.emit();
    }

    prevImage() {
        this.currentIndex =
            this.currentIndex > 0
                ? this.currentIndex - 1
                : this.images.length - 1;
    }

    nextImage() {
        this.currentIndex =
            this.currentIndex < this.images.length - 1
                ? this.currentIndex + 1
                : 0;
    }

    onImageError(event: any, imageName?: string): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src =
            imageName === 'avatar'
                ? 'images/others/blank-profile.png'
                : 'images/others/blank-photo.png';
    }
}
