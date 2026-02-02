import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[securePassword]',
    standalone: true
})
export class SecurePasswordDirective {

    constructor(private el: ElementRef<HTMLInputElement>) { }

    private get isHiddenPassword(): boolean {
        return this.el.nativeElement.type === 'password';
    }

    // ❌ BLOCK COPY when password is hidden
    @HostListener('copy', ['$event'])
    onCopy(event: ClipboardEvent) {
        if (this.isHiddenPassword) {
            event.preventDefault();
        }
    }

    // ❌ BLOCK CUT when password is hidden
    @HostListener('cut', ['$event'])
    onCut(event: ClipboardEvent) {
        if (this.isHiddenPassword) {
            event.preventDefault();
        }
    }

    // ✅ ALLOW PASTE always
    @HostListener('paste', ['$event'])
    onPaste(_: ClipboardEvent) {
        // intentionally allowed
    }
}
