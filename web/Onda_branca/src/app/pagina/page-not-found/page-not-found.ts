import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.updateMetaTags404();
  }

  // SEO + Open Graph + Twitter
  updateMetaTags404() {

    this.titleService.setTitle('Página não encontrada | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'A página que procura não foi encontrada. Explore os serviços da Onda Branca e regresse à página inicial.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: '404, página não encontrada, erro 404, Onda Branca'
    });

    // Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: 'Página não encontrada | Onda Branca'
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'A página que procura não existe ou foi movida. Continue a navegar pelo website da Onda Branca.'
    });

    this.meta.updateTag({
      property: 'og:image',
      content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/not-found/not-found.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2Uvbm90LWZvdW5kL25vdC1mb3VuZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDk5MzUzLCJleHAiOjIxMDA4NTkzNTN9.VxaMU-ihDXlSAD5xRzpAfOc4N6T2V7Lp5tw6Ua407cg'
    });

    this.meta.updateTag({
      property: 'og:url',
      content: 'https://ondabrancaangola.com/404'
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });

    // Twitter
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Página não encontrada | Onda Branca'
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: 'A página que procura não foi encontrada. Volte à página inicial da Onda Branca.'
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://wxopwlmdtfupztzdmtzb.supabase.co/storage/v1/object/sign/GestDremasImage/not-found/not-found.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYzM3Zjg5Ny05YzgwLTRiYzctYjZlZS0yMjEwMGQ3Mzk0YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJHZXN0RHJlbWFzSW1hZ2Uvbm90LWZvdW5kL25vdC1mb3VuZC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NDk5MzUzLCJleHAiOjIxMDA4NTkzNTN9.VxaMU-ihDXlSAD5xRzpAfOc4N6T2V7Lp5tw6Ua407cg'
    });

    // Evita indexação da página 404
    this.meta.updateTag({
      name: 'robots',
      content: 'noindex, nofollow'
    });
  }

}