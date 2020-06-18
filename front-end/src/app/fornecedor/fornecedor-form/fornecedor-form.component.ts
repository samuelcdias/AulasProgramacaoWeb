import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../fornecedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {

  title: string = 'Novo fornecedor'

  fornecedor: any = {} // Objeto vazio
  
  constructor(
    private fornecedorSrv: FornecedorService,
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
        this.fornecedor = await this.fornecedorSrv.obterUm(params['id'])
        this.title = 'Atualizar fornecedor'
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }

  voltar(x) {

  }

  async salvar(form: NgForm) {
    // Só tenta salvar se o form for válido
    if(form.valid) {
      try{
        let msg = 'Fornecedor atualizado com sucesso.'
        // Se existir o campo _id, é o caso de atualização
        if(this.fornecedor._id) {
          await this.fornecedorSrv.atualizar(this.fornecedor)
        }
        // Senão, é caso de criar um novo
        else {
          console.log('ok 1')
          await this.fornecedorSrv.novo(this.fornecedor)
          console.log('ok 2')
          msg = 'Fornecedor criado com sucesso.'
        }
        // Dá o feedback para o usuário
        this.snackBar.open(msg, 'Entendi', {duration: 5000})
        // Voltar À listagem
        this.router.navigate(['/fornecedor'])
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }
}
