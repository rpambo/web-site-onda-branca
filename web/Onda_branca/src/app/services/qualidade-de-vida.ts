import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QualidadeVidaInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class QualidadeDeVida {
  private apiUrl = 'http://localhost:8080/v1/qualidade-vida/email'
  
  constructor(private http: HttpClient){}
    
  sendEmail(data: QualidadeVidaInterface) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}
