import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-programa-de-saude-mental',
  imports: [
    Navbar,
    Footer,
  ],
  templateUrl: './programa-de-saude-mental.html',
  styleUrls: ['./programa-de-saude-mental.css']
})
export class ProgramaDeSaudeMental implements OnInit {

  constructor(private meta: Meta, private titleService: Title) {}

  ngOnInit() {
    this.updateMetaTagsPrograma();
  }

  updateMetaTagsPrograma() {
    this.titleService.setTitle('Programa de Saúde Mental | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Descubra o Programa de Saúde Mental da Onda Branca: soluções práticas para empresas e gestores melhorarem o bem-estar e a produtividade de suas equipes.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'programa de saúde mental, bem-estar, produtividade, gestão, empresa, Onda Branca, liderança consciente'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Programa de Saúde Mental | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'A Onda Branca oferece soluções de saúde mental para empresas e gestores. Conheça nosso programa completo e transforme sua equipe.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-programa-saude-mental.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/programa-de-saude-mental' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Programa de Saúde Mental | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Soluções de saúde mental para empresas e gestores. Aprimore o bem-estar e a produtividade com o Programa da Onda Branca.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-programa-saude-mental.png' });
  }

}
