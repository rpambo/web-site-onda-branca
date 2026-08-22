import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import { Meta, Title } from '@angular/platform-browser';
import { FormPalestra } from '../../components/formularios/form-palestra/form-palestra';

@Component({
  selector: 'app-palestra-e-workshop',
  imports: [
    Navbar,
    Footer,
    FormPalestra,
],
  templateUrl: './palestra-e-workshop.html',
  styleUrls: ['./palestra-e-workshop.css']
})
export class PalestraEWorkshop implements OnInit {

  constructor(private meta: Meta, private titleService: Title) {}

  ngOnInit() {
    this.updateMetaTagsPalestra();
  }

  updateMetaTagsPalestra() {
    this.titleService.setTitle('Palestra e Workshop | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Participe da Palestra e Workshop da Onda Branca: ferramentas práticas para gestão de ansiedade, produtividade e qualidade de vida no trabalho.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'palestra, workshop, ansiedade, produtividade, qualidade de vida, Onda Branca, saúde mental'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Palestra e Workshop | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Aprenda técnicas de gestão emocional e produtividade com a Onda Branca. Participe do nosso workshop e transforme sua rotina.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/palestra-e-workshop/hero-palestra-e-workshop.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtlV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvcGFsZXN0cmEtZS13b3Jrc2hvcC9oZXJvLXBhbGVzdHJhLWUtd29ya3Nob3Aud2VicCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU0OTQ2MDAsImV4cCI6MjEwMDg1NDYwMH0.X5uVSFTmyA-NmvEys4_ZqmlGbiVwIbOPRW7SUrj3Vug' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabrancaangola.com/palestra-e-workshop' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Palestra e Workshop | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Participe da nossa palestra e workshop para desenvolver habilidades de gestão emocional, produtividade e bem-estar.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/palestra-e-workshop/hero-palestra-e-workshop.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvcGFsZXN0cmEtZS13b3Jrc2hvcC9oZXJvLXBhbGVzdHJhLWUtd29ya3Nob3Aud2VicCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU0OTQ2MDAsImV4cCI6MjEwMDg1NDYwMH0.X5uVSFTmyA-NmvEys4_ZqmlGbiVwIbOPRW7SUrj3Vug' });
  }

  scrollToForm(): void {
    document.getElementById('formulario')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

}
