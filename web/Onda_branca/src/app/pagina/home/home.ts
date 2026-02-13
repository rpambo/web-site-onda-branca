import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Slides } from "../../components/home/hero/slides";
import { Footer } from '../../components/footer/footer';
import { Meta, Title } from '@angular/platform-browser';
import { Services } from '../../components/home/services/services';
import { CommonModule } from '@angular/common';
import { ParceiroCliente } from '../../components/home/parceiro-cliente/parceiro-cliente';
import { Podcasthome } from "../../components/home/podcasthome/podcasthome";
import { Homecomunidade } from '../../components/home/homecomunidade/homecomunidade';

declare var UIkit: any;

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    Slides,
    Footer,
    Services,
    CommonModule,
    ParceiroCliente,
    Podcasthome,
    Homecomunidade
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private meta: Meta, private titleService: Title) {}

  updateMetaTags() {

    // -------- TÍTULO --------
    this.titleService.setTitle('Onda Branca - Programa de Saúde Mental e Produtividade');

    // -------- META TAGS PRINCIPAIS --------
    this.meta.updateTag({
      name: 'description',
      content: 'A Onda Branca é um programa da Gest Dream dedicado à promoção da saúde mental, bem-estar, produtividade e impacto social através de iniciativas digitais, eventos e projetos comunitários.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'saúde mental, produtividade, bem-estar, projeto social, programa, Onda Branca, Gest Dream, comunidade, apoio psicológico, desenvolvimento humano'
    });

    // -------- OPEN GRAPH (FACEBOOK, WHATSAPP, LINKEDIN) --------
    this.meta.updateTag({
      property: 'og:title',
      content: 'Onda Branca - Programa de Saúde Mental e Produtividade'
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'Programa da Gest Dream focado em saúde mental, produtividade e impacto social através de soluções digitais e comunitárias.'
    });

    this.meta.updateTag({
      property: 'og:image',
      content: 'https://ondabranca.com/imagens/logo.png'
    });

    this.meta.updateTag({
      property: 'og:url',
      content: 'https://ondabranca.com'
    });

    // Tipo adequado para programa/projeto
    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });

    // -------- TWITTER CARDS --------
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Onda Branca - Programa de Saúde Mental e Produtividade'
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: 'A Onda Branca é um programa da Gest Dream dedicado à saúde mental, bem-estar e produtividade.'
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://ondabranca.com/imagens/logo.png'
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });
  }

  showWelcomeModal = false;

  ngOnInit() {
    this.updateMetaTags();
  }
}