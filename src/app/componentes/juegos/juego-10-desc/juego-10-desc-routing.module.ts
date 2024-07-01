import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Juego10DescPage } from './juego-10-desc.page';

const routes: Routes = [
  {
    path: '',
    component: Juego10DescPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Juego10DescPageRoutingModule {}
