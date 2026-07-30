import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramaSaudeMentalTrabalhador } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProgramaSaudeMentalTrabalhadorService {
  private apiUrl = 'http://localhost:8080/v1/saude-mental/email'
  
  constructor(private http: HttpClient){}
    
  sendEmail(data: ProgramaSaudeMentalTrabalhador) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  }

}
