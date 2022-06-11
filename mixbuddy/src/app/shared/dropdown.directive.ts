import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

/*
 * The directives are classes that add additional behavior to elem-
 * ents in your Angular applications.
 *
 * This directive adds a CSS class "open" to the element it sits on
 * when it is clicked on, and removes it when we click again.
 */
@Directive({
  selector: '[appDropdown]', // attribute selector
})
export class DropdownDirective {
  /*
   * Allows us to bind to properties of the elements the directive is
   * placed on.
   */
  @HostBinding('class.open') isOpen = false;

  /*
   * Listening to the click event, adds CSS class to its element once
   * it's clicked and remove it once it's clicked again.
   */
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }

  constructor(private elRef: ElementRef) {}
}
