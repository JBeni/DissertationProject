import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CompanyBuilderComponent } from './components/company-builder/company-builder.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectInitiatorComponent } from './components/project-initiator/project-initiator.component';
import { ProjectSupervisorComponent } from './components/project-supervisor/project-supervisor.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'project-initiator', component: ProjectInitiatorComponent },
    { path: 'company-builder', component: CompanyBuilderComponent },
    { path: 'project-supervisor', component: ProjectSupervisorComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'user-profile', component: UserProfileComponent },

    { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
