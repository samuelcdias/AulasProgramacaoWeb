import { ClienteService } from './../../cliente/cliente.service';
import { Component, OnInit } from '@angular/core';
import { VendaService } from '../venda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.scss']
})
export class VendaFormComponent implements OnInit {

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
    private vendaSrv: VendaService,
    private clienteSrv: ClienteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog
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
        this.venda = await this.vendaSrv.obterUm(params['id'])
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

  async voltar(form: NgForm) {

    let result = true;
    console.log(form);
    // form.dirty = formulário "sujo", não salvo (via código)
    // form.touched = o conteúdo de algum campo foi alterado (via usuário)
    if(form.dirty && form.touched) {
      let dialogRef = this.dialog.open(ConfirmDlgComponent, {
        width: '50%',
        data: { question: 'Há dados não salvos. Deseja realmente voltar?' }
      });

      result = await dialogRef.afterClosed().toPromise();

    }

    if(result) {
      this.router.navigate(['/venda']); // Retorna à listagem
    }
  }

  async salvar(form: NgForm) {
    // Só tenta salvar se o form for válido
    if(form.valid) {
      try{
        let msg = 'Venda atualizada com sucesso.'
        // Se existir o campo _id, é o caso de atualização
        if(this.venda._id) {
          await this.vendaSrv.atualizar(this.venda)
        }
        // Senão, é caso de criar um nova
        else {
          await this.vendaSrv.novo(this.venda)
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
