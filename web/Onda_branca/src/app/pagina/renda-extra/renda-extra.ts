import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from "../../components/footer/footer";
import { FormQualidadeVida } from '../../components/formularios/form-qualidade-vida/form-qualidade-vida';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-renda-extra',
  imports: [Navbar, Footer, FormQualidadeVida],
  templateUrl: './renda-extra.html',
  styleUrl: './renda-extra.css'
})
export class RendaExtra implements OnInit {
  constructor(private meta: Meta, private titleService: Title) {}

updateMetaTagsProjetoQualidadeDeVida() {
  this.titleService.setTitle('Projeto de Qualidade de Vida | Onda Branca');

  // Meta padrão
  this.meta.updateTag({
    name: 'description',
    content:
      'Conheça o Projeto de Qualidade de Vida da Onda Branca: estratégias práticas para promover bem-estar, equilíbrio emocional e melhoria da saúde no dia a dia.'
  });
  this.meta.updateTag({
    name: 'keywords',
    content:
      'qualidade de vida, bem-estar, equilíbrio emocional, saúde, produtividade saudável, Onda Branca, projeto de qualidade de vida'
  });

  // Meta Open Graph (para redes sociais)
  this.meta.updateTag({
    property: 'og:title',
    content: 'Projeto de Qualidade de Vida | Onda Branca'
  });
  this.meta.updateTag({
    property: 'og:description',
    content:
      'Soluções práticas para melhorar a saúde emocional, física e o bem-estar geral no cotidiano.'
  });
  this.meta.updateTag({
    property: 'og:image',
    content: 'https://ondabranca.com/imagens/og-qualidade-de-vida.png'
  });
  this.meta.updateTag({
    property: 'og:url',
    content: 'https://ondabranca.com/projeto-de-qualidade-de-vida'
  });
  this.meta.updateTag({ property: 'og:type', content: 'article' });

  // Twitter Cards (para melhor preview no X)
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({
    name: 'twitter:title',
    content: 'Projeto de Qualidade de Vida | Onda Branca'
  });
  this.meta.updateTag({
    name: 'twitter:description',
    content:
      'Descubra caminhos práticos para elevar o bem-estar, melhorar a saúde e promover equilíbrio sustentável.'
  });
  this.meta.updateTag({
    name: 'twitter:image',
    content: 'https://ondabranca.com/imagens/og-qualidade-de-vida.png'
  });
}

ngOnInit() {
  this.updateMetaTagsProjetoQualidadeDeVida();
}

scrollToForm(): void {
  document
    .getElementById('formulario')
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
}

}
