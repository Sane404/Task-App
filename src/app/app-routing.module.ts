import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TasksComponent } from './tasks/tasks.component';
import { GuardGuard } from './shared/guard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {path:'',redirectTo:'tasks',pathMatch:'full'},
  {path:'signUp',component:SignUpComponent},
  {path:'tasks',component:TasksComponent,canActivate:[GuardGuard]},
  {path:'dashboard',component:DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
