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
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-palestra.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/palestra-e-workshop' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Palestra e Workshop | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Participe da nossa palestra e workshop para desenvolver habilidades de gestão emocional, produtividade e bem-estar.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-palestra.png' });
  }

  scrollToForm(): void {
    document.getElementById('formulario')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

}
