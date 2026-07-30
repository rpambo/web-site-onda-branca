import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { FormP7Mentoria } from '../../components/formularios/form-p7-mentoria/form-p7-mentoria';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-p7-mentoria',
  imports: [
    Navbar,
    Footer,
    FormP7Mentoria
  ],
  templateUrl: './p7-mentoria.html',
  styleUrls: ['./p7-mentoria.css']
})
export class P7Mentoria implements OnInit {

  constructor(private meta: Meta, private titleService: Title) {}

  ngOnInit() {
    this.updateMetaTagsMentoria();
  }

  updateMetaTagsMentoria() {
    this.titleService.setTitle('Mentoria de Saúde Emocional do Trabalhador | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Conheça a Mentoria de Saúde Emocional do Trabalhador da Onda Branca: apoio estratégico para líderes e empresas fortalecerem o bem-estar emocional das suas equipes.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'mentoria de saúde emocional do trabalhador, bem-estar, gestão emocional, liderança, empresas, Onda Branca, saúde mental corporativa'
    });

    // Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: 'Mentoria de Saúde Emocional do Trabalhador | Onda Branca'
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Mentoria especializada para líderes e gestores que desejam fortalecer o bem-estar emocional de suas equipes.'
    });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://ondabranca.com/imagens/og-mentoria-saude-mental.png'
    });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://ondabranca.com/p7-mentoria'
    });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Mentoria de Saúde Emocional do Trabalhador | Onda Branca'
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: 'Apoio estratégico em saúde emocional para líderes e empresas. Conheça a mentoria da Onda Branca.'
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://ondabranca.com/imagens/og-mentoria-saude-mental.png'
    });
  }

  scrollToForm(): void {
    document.getElementById('formulario')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  
}