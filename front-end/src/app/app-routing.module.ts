import { ItemVendaListComponent } from './item-venda/item-venda-list/item-venda-list.component';
import { VendaFormComponent } from './venda/venda-form/venda-form.component';
import { FornecedorFormComponent } from './fornecedor/fornecedor-form/fornecedor-form.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedorListComponent } from './fornecedor/fornecedor-list/fornecedor-list.component';
import { VendaListComponent } from './venda/venda-list/venda-list.component';
import { ItemVendaFormComponent } from './item-venda/item-venda-form/item-venda-form.component';


const routes: Routes = [
  {
    path: 'fornecedor', // No Angular, não se uso / no começo
    component: FornecedorListComponent
  },
  {
    path: 'fornecedor/novo', // Cadastrar novo fornecedor
    component: FornecedorFormComponent
  },
  {
    path: 'fornecedor/:id', // Editar um fornecedor já existente
    component: FornecedorFormComponent
  },
  {
    path: 'venda',
    component: VendaListComponent
  },
  {
    path: 'venda/novo',
    component: VendaFormComponent
  },
  {
    path:'venda/:id',
    component: VendaFormComponent
  },
  {
    path:'item-venda',
    component: ItemVendaListComponent
  },
  {
    path:'item-venda/novo',
    component: ItemVendaFormComponent
  },
  {
    path:'item-venda/:id',
    component: ItemVendaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
