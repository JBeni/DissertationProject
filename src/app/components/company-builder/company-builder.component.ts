import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { AddCompanyComponent } from '../modals/add-company/add-company.component';

@Component({
    selector: 'app-company-builder',
    templateUrl: './company-builder.component.html',
    styleUrls: ['./company-builder.component.css'],
})
export class CompanyBuilderComponent implements OnInit {
    displayedCompanysColumns: string[] = ['id', 'name', 'actions'];
    dataSourceCompanys!: MatTableDataSource<CompanyModel>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        // private snackBarService: SnackBarService
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddCompanyComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    applyFilterCompanys(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceCompanys.filter = filterValue.trim().toLowerCase();
    }
}
