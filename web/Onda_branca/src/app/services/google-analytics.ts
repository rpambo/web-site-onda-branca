import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  private scriptLoaded = false;

  loadScript(measurementId: string): void {
    if (this.scriptLoaded) return;

    // Cria o elemento <script> do GA
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Inicializa o GA
    const script2 = document.createElement('script');
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);

    this.scriptLoaded = true;
  }
}