import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MVPComponent } from './mvp/mvp/mvp.component';

const routes: Routes = [
  { path: '', component: MVPComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
