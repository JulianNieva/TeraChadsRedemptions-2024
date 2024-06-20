import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-cliente',
    loadChildren: () => import('./paginas/registro-cliente/registro-cliente.module').then( m => m.RegistroClientePageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./paginas/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'solicitar-mesa',
    loadChildren: () => import('./paginas/solicitar-mesa/solicitar-mesa.module').then( m => m.SolicitarMesaPageModule)
  },
  {
    path: 'aprobacion-clientes',
    loadChildren: () => import('./paginas/aprobacion-clientes/aprobacion-clientes.module').then( m => m.AprobacionClientesPageModule)
  },  {
    path: 'fila-clientes',
    loadChildren: () => import('./paginas/fila-clientes/fila-clientes.module').then( m => m.FilaClientesPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
