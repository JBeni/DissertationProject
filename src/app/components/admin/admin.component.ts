import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { AddUserComponent } from '../modals/add-user/add-user.component';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    displayedUsersColumns: string[] = ['id', 'username', 'address', 'role', 'actions'];
    dataSourceUsers!: MatTableDataSource<UserModel>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        // private snackBarService: SnackBarService
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddUserComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    applyFilterUsers(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceUsers.filter = filterValue.trim().toLowerCase();
    }
}
