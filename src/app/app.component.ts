import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    menuOpened: boolean = false;

    @ViewChild("header_toggle", { read: ElementRef }) toggle!: ElementRef;
    @ViewChild("nav_bar", { read: ElementRef }) nav!: ElementRef;
    @ViewChild("body_pd", { read: ElementRef }) bodypd!: ElementRef;
    @ViewChild("header", { read: ElementRef }) headerpd!: ElementRef;

    // @ViewChild("nav__link") navLinks!: ElementRef;

    constructor() {}

    menuSlide(): void {
        if (this.menuOpened === false) {
            this.nav.nativeElement.classList.add('show');
            this.toggle.nativeElement.classList.add('bx-x');
            this.bodypd.nativeElement.classList.add('body-pd');
            this.headerpd.nativeElement.classList.add('body-pd');
            this.menuOpened = true;
        } else {
            this.nav.nativeElement.classList.remove('show');
            this.toggle.nativeElement.classList.remove('bx-x');
            this.bodypd.nativeElement.classList.remove('body-pd');
            this.headerpd.nativeElement.classList.remove('body-pd');
            this.menuOpened = false;
        }
    }

    // activeMenuOption(): void {
    //     if(this.navLinks) {

    //         this.navLinks.forEach(l => l.classList.remove('active'));
    //         this.navLinks.nativeElement.classList.add('active');
    //     }
    // }

}
