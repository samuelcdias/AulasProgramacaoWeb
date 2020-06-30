import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProdutoService } from 'src/app/produto/produto.service';
import { VendaService } from 'src/app/venda/venda.service';
import { ItemVendaService } from '../item-venda.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-item-venda-form',
  templateUrl: './item-venda-form.component.html',
  styleUrls: ['./item-venda-form.component.scss']
})
export class ItemVendaFormComponent implements OnInit {

  title: string = 'Novo item de venda'

  itemVenda: any = {
    desconto: 0,
    acrescimo: 0
  } 

  // Entidades relacionadas
  vendas : any = [] // Vetor vazio
  produtos : any = [] // Vetor vazio
  
  constructor(
    private itemVendaSrv: ItemVendaService,
    private vendaSrv: VendaService,
    private produtoSrv: ProdutoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute,
    private Location: Location
  ) { }

  async ngOnInit() {
    // Capturando os parâmetros da rota
    let params = this.actRoute.snapshot.params

    // Existe um parâmetro chamado : id?
    if(params['id']) {
      // É caso de atualização. É necessário consultar
      // o back-end para recuperar o resgisto e colocar
      // para edição
      try {
        this.itemVenda = await this.itemVendaSrv.obterUm(params['id'])
        this.title = 'Atualizando item de venda'
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }

    // Entidades relacionadas
    try {
      this.vendas = await this.vendaSrv.listar()
      this.produtos = await this.produtoSrv.listar()
    }
    catch(erro) {
      this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
    }
  }

  voltar(x) {

  }

  async salvar(form: NgForm) {
    // Só tenta salvar se o form for válido
    if(form.valid) {
      try{
        let msg = 'Item de venda atualizado com sucesso.'
        // Se existir o campo _id, é o caso de atualização
        if(this.itemVenda._id) {
          await this.itemVendaSrv.atualizar(this.itemVenda)
        }
        // Senão, é caso de criar um nova
        else {
          console.log('ok 1')
          await this.itemVendaSrv.novo(this.itemVenda)
          console.log('ok 2')
          msg = 'Item de venda criado com sucesso.'
        }
        // Dá o feedback para o usuário
        this.snackBar.open(msg, 'Entendi', {duration: 5000})
        // Voltar À listagem
        this.Location.back()
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }
}
