import { Injectable } from '@angular/core';
import { P7MentoriaInterface } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramaSaudeMentalTrabalhadorServiceSete {
  private apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/mentoria/email'
  
  constructor(private http: HttpClient){}
    
  sendEmail(data: P7MentoriaInterface) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  } 
}
