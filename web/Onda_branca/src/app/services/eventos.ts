import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetSessoesResponse, SessaoEvento, ReservaEventoRequest } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class Eventos {

  private readonly apiUrl = 'https://web-site-onda-branca-env.up.railway.app/v1/reserva-evento';

  constructor(private http: HttpClient) {}

  // versão limpa (RECOMENDADA)
  getAllSessoes(): Observable<SessaoEvento[]> {
    return this.http
      .get<GetSessoesResponse>(`${this.apiUrl}/sessoes`)
      .pipe(
        map(res => res.data?.data ?? [])
      );
  }

  create(reserva: ReservaEventoRequest): Observable<SessaoEvento> {
    return this.http.post<SessaoEvento>(
      `${this.apiUrl}/criar-reserva`,
      reserva
    );
  }
}