import { Component, OnInit } from '@angular/core';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-termo-de-uso',
  imports: [Footer, Navbar],
  templateUrl: './termo-de-uso.html',
  styleUrls: ['./termo-de-uso.css']
})
export class TermoDeUso implements OnInit {

  constructor(private meta: Meta, private titleService: Title) {}

  ngOnInit() {
    this.updateMetaTagsTermo();
  }

  updateMetaTagsTermo() {
    this.titleService.setTitle('Termo de Uso | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Leia os Termos de Uso da Onda Branca: regras e condições para utilização do nosso site e serviços.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'termos de uso, política de uso, Onda Branca, regras, condições, site'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Termo de Uso | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Confira os Termos de Uso da Onda Branca e entenda as regras e condições para utilizar nossos serviços e site.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-termo-de-uso.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/termo-de-uso' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Termo de Uso | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Leia os Termos de Uso da Onda Branca e saiba como utilizar corretamente nossos serviços e site.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-termo-de-uso.png' });
  }

}

