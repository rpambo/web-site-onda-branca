import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { Beneficio } from '../../components/comunidade/beneficio/beneficio';
import { Intro } from "../../components/comunidade/intro/intro";
import { Participar } from "../../components/comunidade/participar/participar";
import { Valores } from '../../components/comunidade/comunidade-valores/valores';
import { PerguntasFrenquentes } from '../../components/comunidade/perguntas-frenquentes/perguntas-frenquentes';
import { ContactoComunidade } from "../../components/contacto/contacto-comunidade/contacto-comunidade";

@Component({
  selector: 'app-comunidade',
  imports: [Navbar, Footer, Beneficio, Intro, Participar, Valores, PerguntasFrenquentes, ContactoComunidade],
  templateUrl: './comunidade.html',
  styleUrl: './comunidade.css'
})
export class Comunidade {

}
