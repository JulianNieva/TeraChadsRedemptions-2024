import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Juego10DescPageRoutingModule } from './juego-10-desc-routing.module';

import { Juego10DescPage } from './juego-10-desc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Juego10DescPageRoutingModule
  ],
  declarations: [Juego10DescPage]
})
export class Juego10DescPageModule {}
