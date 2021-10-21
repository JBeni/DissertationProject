import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
    @ViewChild("modal_container") modal_container!: ElementRef;

    constructor() {}

    ngOnInit(): void {}
}
