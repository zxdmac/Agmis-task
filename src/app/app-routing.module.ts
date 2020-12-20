import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PickLocationComponent} from './pick-location/pick-location.component';
import {HelpComponent} from './help/help.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'location', component: PickLocationComponent},
  {path: 'help', component: HelpComponent},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
