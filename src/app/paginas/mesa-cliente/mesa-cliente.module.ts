import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaClientePageRoutingModule } from './mesa-cliente-routing.module';

import { MesaClientePage } from './mesa-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaClientePageRoutingModule
  ],
  declarations: [MesaClientePage]
})
export class MesaClientePageModule {}
