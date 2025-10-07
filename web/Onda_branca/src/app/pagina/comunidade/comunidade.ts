import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { Beneficio } from '../../components/comunidade/beneficio/beneficio';
import { Intro } from "../../components/comunidade/intro/intro";
import { Participar } from "../../components/comunidade/participar/participar";
import { Valores } from '../../components/comunidade/comunidade-valores/valores';
import { PerguntasFrenquentes } from '../../components/comunidade/perguntas-frenquentes/perguntas-frenquentes';
import { ContactoComunidade } from "../../components/contacto/contacto-comunidade/contacto-comunidade";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comunidade',
  imports: [Navbar, Footer, Beneficio, Intro, Participar, Valores, PerguntasFrenquentes, ContactoComunidade],
  templateUrl: './comunidade.html',
  styleUrl: './comunidade.css'
})
export class Comunidade {
  constructor(private meta: Meta, private titleService: Title) {}
  
  updateMetaTagsComunidade() {
  this.titleService.setTitle('Comunidade | Onda Branca');

// Meta padrão
this.meta.updateTag({
  name: 'description',
  content:
    'Junte-se à comunidade Onda Branca: um espaço de apoio, troca de experiências e crescimento coletivo em saúde mental e bem-estar.'
});
this.meta.updateTag({
  name: 'keywords',
  content:
    'comunidade saúde mental, apoio emocional, grupo de apoio, bem-estar coletivo, troca de experiências, rede de apoio, Onda Branca'
});

// Meta Open Graph (para redes sociais)
this.meta.updateTag({
  property: 'og:title',
  content: 'Comunidade | Onda Branca'
});
this.meta.updateTag({
  property: 'og:description',
  content:
    'Participe da nossa comunidade de apoio mútuo em saúde mental. Encontre acolhimento, compartilhe vivências e cresça junto com outras pessoas.'
});
this.meta.updateTag({
  property: 'og:image',
  content: 'https://ondabranca.com/imagens/og-comunidade.png' // imagem específica para a página
});
this.meta.updateTag({
  property: 'og:url',
  content: 'https://ondabranca.com/comunidade'
});
this.meta.updateTag({ property: 'og:type', content: 'website' });

// Twitter Cards (para melhor preview no X/Twitter)
this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
this.meta.updateTag({
  name: 'twitter:title',
  content: 'Comunidade | Onda Branca'
});
this.meta.updateTag({
  name: 'twitter:description',
  content:
    'Um espaço seguro para compartilhar jornadas em saúde mental. Conecte-se com pessoas que entendem sua experiência e junte-se à nossa rede de apoio.'
});
this.meta.updateTag({
  name: 'twitter:image',
  content: 'https://ondabranca.com/imagens/og-comunidade.png'
});
}

ngOnInit() {
  this.updateMetaTagsComunidade();
}
}
