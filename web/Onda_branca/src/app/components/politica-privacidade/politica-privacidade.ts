import { Component, OnInit } from '@angular/core';
import { Footer } from "../footer/footer";
import { Navbar } from '../navbar/navbar';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-politica-privacidade',
  imports: [Footer, Navbar],
  templateUrl: './politica-privacidade.html',
  styleUrls: ['./politica-privacidade.css']
})
export class PoliticaPrivacidade implements OnInit {

  constructor(private meta: Meta, private titleService: Title) {}

  ngOnInit() {
    this.updateMetaTagsPolitica();
  }

  updateMetaTagsPolitica() {
    this.titleService.setTitle('Política de Privacidade | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Leia a Política de Privacidade da Onda Branca: saiba como coletamos, usamos e protegemos os seus dados ao utilizar nossos serviços e site.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'política de privacidade, dados pessoais, segurança, Onda Branca, proteção de dados, site'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Política de Privacidade | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Entenda como a Onda Branca coleta, utiliza e protege os seus dados pessoais ao acessar nossos serviços e site.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-politica-privacidade.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/politica-privacidade' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Política de Privacidade | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Confira a Política de Privacidade da Onda Branca e saiba como seus dados são protegidos e utilizados.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-politica-privacidade.png' });
  }

}
