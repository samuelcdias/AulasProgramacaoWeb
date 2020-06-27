import { ClienteService } from './../../cliente/cliente.service';
import { Component, OnInit } from '@angular/core';
import { ItemVendaService } from '../item-venda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-item-venda-form',
  templateUrl: './item-venda-form.component.html',
  styleUrls: ['./item-venda-form.component.scss']
})
export class ItemVendaFormComponent implements OnInit {

  title: string = 'Nova venda'

  venda: any = {} // Objeto vazio

  // Entidades relacionadas
  clientes : any = [] // Vetor vazio

  formasPagamento: any = [
    {
      codigo:'DI',
      nome: 'DI - dinheiro'
    },
    {
      codigo:'CH',
      nome: 'CH - cheque'
    },
    {
      codigo:'CC',
      nome: 'CC - cartão de crédito'
    },
    {
      codigo:'CD',
      nome: 'CD - cartão de débito'
    }
  ]
  
  constructor(
    private itemVendaSrv: ItemVendaService,
    private clienteSrv: ClienteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute
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
        this.venda = await this.itemVendaSrv.obterUm(params['id'])
        this.title = 'Atualizando venda'
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }

    // Entidades relacionadas
    try {
      this.clientes = await this.clienteSrv.listar()
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
        let msg = 'Venda atualizada com sucesso.'
        // Se existir o campo _id, é o caso de atualização
        if(this.venda._id) {
          await this.itemVendaSrv.atualizar(this.venda)
        }
        // Senão, é caso de criar um nova
        else {
          console.log('ok 1')
          await this.itemVendaSrv.novo(this.venda)
          console.log('ok 2')
          msg = 'Venda criada com sucesso.'
        }
        // Dá o feedback para o usuário
        this.snackBar.open(msg, 'Entendi', {duration: 5000})
        // Voltar À listagem
        this.router.navigate(['/venda'])
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }
}
