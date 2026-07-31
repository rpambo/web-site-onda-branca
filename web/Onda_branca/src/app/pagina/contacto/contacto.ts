import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Services } from "../../components/home/services/services";

@Component({
  selector: 'app-contacto',
  imports: [Navbar, Footer, CommonModule, Services],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.updateMetaTagsContacto();
  }

  // Atualiza meta tags para SEO, Open Graph e Twitter Cards
  updateMetaTagsContacto() {
    this.titleService.setTitle('Contacto | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Entre em contacto com a Onda Branca para esclarecer dúvidas, solicitar serviços ou parcerias. Estamos disponíveis para ajudá-lo da melhor forma possível.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'contacto, serviços Onda Branca, mentoria, ginástica laboral, saúde mental, workshops, empresa'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Contacto | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Fale conosco e conheça todos os serviços da Onda Branca. Estamos aqui para apoiar você ou sua empresa.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/contacto/contacto-topo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvY29udGFjdG8vY29udGFjdG8tdG9wby53ZWJwIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTQ5NDE4OSwiZXhwIjoyMTAwODU0MTg5fQ.NNputu9TqJ41cdXHfGw6NL6a96C1Xf6bonouxbkgIBE' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/contacto' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Contacto | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Entre em contacto com a Onda Branca e conheça nossos serviços de apoio, saúde mental e bem-estar.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/contacto/contacto-topo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2UvY29udGFjdG8vY29udGFjdG8tdG9wby53ZWJwIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTQ5NDE4OSwiZXhwIjoyMTAwODU0MTg5fQ.NNputu9TqJ41cdXHfGw6NL6a96C1Xf6bonouxbkgIBE' });
  }
  
}