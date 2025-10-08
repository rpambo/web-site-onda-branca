import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-contacto',
  imports: [Navbar, Footer, RouterLink],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {

}
