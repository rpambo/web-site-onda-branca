import { Injectable } from '@angular/core';
import { emailMarketing } from '../interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailMarketing {
  apiUrl = ''

  constructor(private http: HttpClient){}
  
  sendEmailMarketing(data: emailMarketing) : Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}