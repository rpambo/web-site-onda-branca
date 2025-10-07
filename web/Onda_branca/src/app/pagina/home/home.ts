import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Slides } from "../../components/home/hero/slides";
import { Footer } from '../../components/footer/footer';
import { Meta, Title } from '@angular/platform-browser';
import { Services } from '../../components/home/services/services';
import { CommonModule } from '@angular/common';
import { Contactos } from "../../components/contacto/contacto-principal/contactos";
import { StaticsSobre } from "../../components/home/statics-sobre/statics-sobre";
import { ParceiroCliente } from '../../components/home/parceiro-cliente/parceiro-cliente';
import { OndaBrancaRadioSolidaria } from '../../components/home/onda-branca-radio-solidaria/onda-branca-radio-solidaria';
import { Homecomunidade } from "../../components/home/homecomunidade/homecomunidade";

declare var UIkit: any; // para usar UIkit direto

@Component({
  selector: 'app-home',
  imports: [Navbar, Slides, Footer, Services, CommonModule, Contactos, StaticsSobre, ParceiroCliente, OndaBrancaRadioSolidaria, Homecomunidade],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {

  constructor(private meta: Meta, private titleService: Title) {}

updateMetaTags() {
  this.titleService.setTitle('Onda Branca - Saúde Mental e Produtividade Empresarial');

  // Meta padrão
  this.meta.updateTag({
    name: 'description',
    content: 'A Onda Branca é uma empresa dedicada a promover saúde mental e produtividade no ambiente de trabalho, com programas, palestras e soluções corporativas.'
  });
  this.meta.updateTag({
    name: 'keywords',
    content: 'saúde mental no trabalho, produtividade, empresa, bem-estar corporativo, Onda Branca, palestras, ginástica laboral'
  });

  // Meta Open Graph (para redes sociais)
  this.meta.updateTag({ property: 'og:title', content: 'Onda Branca - Saúde Mental e Produtividade Empresarial' });
  this.meta.updateTag({ property: 'og:description', content: 'Empresa especializada em soluções de saúde mental e produtividade para organizações.' });
  this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/logo.png' }); // substitui por uma URL pública real
  this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com' });
  this.meta.updateTag({ property: 'og:type', content: 'business.business' }); // tipo mais adequado para empresa
}

showWelcomeModal = false;

ngOnInit() {
  this.updateMetaTags();
}
}
