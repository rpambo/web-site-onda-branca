import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { FormEvntos } from '../../components/formularios/form-evntos/form-evntos';

@Component({
  selector: 'app-eventos',
  imports: [Navbar, Footer, FormEvntos],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos {

}
