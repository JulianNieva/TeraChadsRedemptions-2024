import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaClientePageRoutingModule } from './mesa-cliente-routing.module';

import { MesaClientePage } from './mesa-cliente.page';
import { ListadoProductosComponent } from 'src/app/componentes/listado-productos/listado-productos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaClientePageRoutingModule
  ],
  declarations: [MesaClientePage,ListadoProductosComponent]
})
export class MesaClientePageModule {}
