import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    menuOpened: boolean = true;

    @ViewChild('header_toggle', { read: ElementRef }) toggle!: ElementRef;
    @ViewChild('nav_bar', { read: ElementRef }) nav!: ElementRef;
    @ViewChild('body_pd', { read: ElementRef }) bodypd!: ElementRef;
    @ViewChild('header', { read: ElementRef }) headerpd!: ElementRef;

    constructor() {}

    ngOnInit(): void {
    }

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
}
