import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { contactService } from '../interfaces'; 

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/enterprises/email'

  constructor(private http: HttpClient) {}

  sendContactForm(data: contactService): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}