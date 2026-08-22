import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PalestraWorkshopInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class Palestra {
  private apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/palestras-workshops/email'
  
  constructor(private http: HttpClient){}
    
  sendEmail(data: PalestraWorkshopInterface) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}
