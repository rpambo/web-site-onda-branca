import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { Bruchura } from '../../components/programa-de-ginastica-laboral/bruchura/bruchura';
import { FormGinasticaLaboral } from '../../components/formularios/form-ginastica-laboral/form-ginastica-laboral';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-programa-ginastica-laboral',
  imports: [Navbar, Footer, Bruchura, FormGinasticaLaboral],
  templateUrl: './programa-ginastica-laboral.html',
  styleUrl: './programa-ginastica-laboral.css'
})
export class ProgramaGinasticaLaboral {
  constructor(private meta: Meta, private titleService: Title) {}
updateMetaTagsGinastica() {
  this.titleService.setTitle('Ginástica Laboral | Onda Branca');

  // Meta padrão
  this.meta.updateTag({
    name: 'description',
    content:
      'Promova saúde, bem-estar e produtividade com o programa de Ginástica Laboral da Onda Branca. Exercícios simples para reduzir o stress, prevenir lesões e melhorar a qualidade de vida no trabalho.'
  });
  this.meta.updateTag({
    name: 'keywords',
    content:
      'ginástica laboral, saúde no trabalho, produtividade, bem-estar, prevenção de lesões, qualidade de vida, Onda Branca'
  });

  // Meta Open Graph (para redes sociais)
  this.meta.updateTag({
    property: 'og:title',
    content: 'Ginástica Laboral | Onda Branca'
  });
  this.meta.updateTag({
    property: 'og:description',
    content:
      'Exercícios práticos e acessíveis que reduzem o stress e aumentam a qualidade de vida no ambiente de trabalho.'
  });
  this.meta.updateTag({
    property: 'og:image',
    content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/programa-ginastica/hero-programa-de-ginastica.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvcHJvZ3JhbWEtZ2luYXN0aWNhL2hlcm8tcHJvZ3JhbWEtZGUtZ2luYXN0aWNhLndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDk0NzcxLCJleHAiOjIxMDA4NTQ3NzF9.919JHOMiK2HvTW04Z3tFUkD9ry-IkNREuky-pMU239c' // imagem específica para a página
  });
  this.meta.updateTag({
    property: 'og:url',
    content: 'https://ondabranca.com/programa-de-ginastica-laboral'
  });
  this.meta.updateTag({ property: 'og:type', content: 'article' });

  // Twitter Cards (para melhor preview no X/Twitter)
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({
    name: 'twitter:title',
    content: 'Ginástica Laboral | Onda Branca'
  });
  this.meta.updateTag({
    name: 'twitter:description',
    content:
      'Saúde e bem-estar no trabalho: descubra os benefícios da Ginástica Laboral para reduzir stress e prevenir problemas físicos.'
  });
  this.meta.updateTag({
    name: 'twitter:image',
    content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/programa-ginastica/hero-programa-de-ginastica.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvcHJvZ3JhbWEtZ2luYXN0aWNhL2hlcm8tcHJvZ3JhbWEtZGUtZ2luYXN0aWNhLndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDk0NzcxLCJleHAiOjIxMDA4NTQ3NzF9.919JHOMiK2HvTW04Z3tFUkD9ry-IkNREuky-pMU239c'
  });
}

ngOnInit() {
  this.updateMetaTagsGinastica();
}

scrollToForm(): void {
    document.getElementById('formulario')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

}
