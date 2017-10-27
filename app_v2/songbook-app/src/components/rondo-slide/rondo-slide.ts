import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Slide} from "ionic-angular";


/**
 * An extended slide that provides better scrolling controls
 */

@Component({
    selector: 'rondo-slide',
    template: `<div class="slide-zoom rondo-slide" #scrollable><ng-content></ng-content></div>`
})
export class RondoSlideComponent extends Slide {

    @ViewChild('scrollable') element;

    @Output()
    onScrollUp: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    onScrollDown: EventEmitter<void> = new EventEmitter<void>();

    private lastScrollPosition: number = -1;

    ngAfterViewInit() {
      this.addScrollHandler();
    }


    private addScrollHandler() {
        let element = this.element.nativeElement;
        element.addEventListener("scroll", (event) => {
            this.manualScrollHandler(event)
        });
    }

    public manualScrollHandler(event) {
        let currentPosition = this.getScrollPosition();
        if (this.lastScrollPosition > currentPosition) {
            this.onScrollUp.emit();
        } else {
            // autoscroll is always +1, don't emit events on that
            let diff = currentPosition - this.lastScrollPosition;
            if (diff > 1) {
                this.onScrollDown.emit();
            }
        }
        this.lastScrollPosition = currentPosition;
    }

    public getScrollPosition() {
        if (this.element.nativeElement) {
            return this.element.nativeElement.scrollTop;
        } else {
            return 0;
        }
    }
}
