import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialsModule } from './shared/materials.shared';
import { AdminComponent } from './components/admin/admin.component';
import { ProjectInitiatorComponent } from './components/project-initiator/project-initiator.component';
import { ProjectSupervisorComponent } from './components/project-supervisor/project-supervisor.component';
import { CompanyBuilderComponent } from './components/company-builder/company-builder.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AddUserComponent } from './components/modals/add-user/add-user.component';
import { AddProjectComponent } from './components/modals/add-project/add-project.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { StepComponent } from './components/step/step.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ViewProjectComponent } from './components/modals/view-project/view-project.component';
import { ViewTimelineComponent } from './components/modals/view-timeline/view-timeline.component';
import { AddCompanyComponent } from './components/modals/add-company/add-company.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        AdminComponent,
        ProjectInitiatorComponent,
        ProjectSupervisorComponent,
        CompanyBuilderComponent,
        UserProfileComponent,
        AddUserComponent,
        AddProjectComponent,
        TimelineComponent,
        StepComponent,
        ProjectsComponent,
        ViewProjectComponent,
        ViewTimelineComponent,
        AddCompanyComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialsModule,

        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
