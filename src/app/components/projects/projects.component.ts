import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectModel } from 'src/app/shared/models/project.model';
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
    displayedProjectsColumns: string[] = ['id', 'name', 'actions'];
    dataSourceProjects!: MatTableDataSource<ProjectModel>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        // private snackBarService: SnackBarService
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    openDialog() {
        const dialogRef = this.dialog.open(TimelineComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    applyFilterProjects(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceProjects.filter = filterValue.trim().toLowerCase();
    }
}
