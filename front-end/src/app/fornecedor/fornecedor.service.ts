import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private http:HttpClient) { }

  listar() {
    return this.http.get('http://localhost:3000/fornecedor').toPromise()
  }

  excluir(id: string) {
    return this.http.request('DELETE', 'http://localhost:3000/fornecedor',
    {body: { _id: id }}).toPromise()
  }
  
}
