import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GinasticaLaboralInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class GinasticaLaboral {
  private apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/ginastica-laboral/email'
  
  constructor(private http: HttpClient){}
    
  sendEmail(data: GinasticaLaboralInterface) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}
