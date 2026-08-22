import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reclamacao } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class CanalDeReclamacao {
  
  private apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/complaints/email'

  constructor(private http: HttpClient){}

  sendReclamationForm(data:reclamacao): Observable<any>{
    return this.http.post(this.apiUrl,data);
  }
}