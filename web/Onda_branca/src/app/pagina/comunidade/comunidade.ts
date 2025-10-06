import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { Beneficio } from '../../components/comunidade/beneficio/beneficio';
import { Intro } from "../../components/comunidade/intro/intro";
import { Participar } from "../../components/comunidade/participar/participar";

@Component({
  selector: 'app-comunidade',
  imports: [Navbar, Footer, Beneficio, Intro, Participar],
  templateUrl: './comunidade.html',
  styleUrl: './comunidade.css'
})
export class Comunidade {

}
