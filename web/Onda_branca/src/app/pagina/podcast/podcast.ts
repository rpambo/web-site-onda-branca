import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-podcast',
  imports: [Navbar],
  templateUrl: './podcast.html',
  styleUrl: './podcast.css'
})
export class Podcast {
  
  constructor(private meta: Meta, private titleService: Title) {}
  updateMetaTagsPodcast() {
  this.titleService.setTitle('Podcast | Onda Branca');

  // Meta padrão
  this.meta.updateTag({
    name: 'description',
    content:
      'Ouça o podcast Onda Branca: conversas sobre saúde mental, bem-estar emocional e autoconhecimento. Episódios com especialistas e histórias inspiradoras.'
  });
  this.meta.updateTag({
    name: 'keywords',
    content:
      'podcast saúde mental, bem-estar emocional, autoconhecimento, psicologia, desenvolvimento pessoal, episódios, audio, Onda Branca'
  });

  // Meta Open Graph (para redes sociais)
  this.meta.updateTag({
    property: 'og:title',
    content: 'Podcast | Onda Branca'
  });
  this.meta.updateTag({
    property: 'og:description',
    content:
      'Explore temas profundos de saúde mental e bem-estar em nosso podcast. Entrevistas com especialistas e reflexões para sua jornada de autoconhecimento.'
  });
  this.meta.updateTag({
    property: 'og:image',
    content: 'https://ondabranca.com/imagens/og-podcast.png' // imagem específica para a página
  });
  this.meta.updateTag({
    property: 'og:url',
    content: 'https://ondabranca.com/podcast'
  });
  this.meta.updateTag({ property: 'og:type', content: 'website' });

  // Twitter Cards (para melhor preview no X/Twitter)
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({
    name: 'twitter:title',
    content: 'Podcast | Onda Branca'
  });
  this.meta.updateTag({
    name: 'twitter:description',
    content:
      'Um podcast dedicado à saúde mental e bem-estar. Conteúdo audio para inspirar reflexões e transformações na sua vida pessoal e profissional.'
  });
  this.meta.updateTag({
    name: 'twitter:image',
    content: 'https://ondabranca.com/imagens/og-podcast.png'
  });
}

ngOnInit() {
  this.updateMetaTagsPodcast();
}
}