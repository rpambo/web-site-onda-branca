import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from './services/google-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected title = 'Onda_branca';
  circles = Array(20);

  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;

  // Injeções
  private ccService = inject(NgcCookieConsentService);
  private cookieService = inject(CookieService);
  private gaService = inject(GoogleAnalyticsService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  // Substitui pelo teu ID real do Google Analytics
  private readonly GA_MEASUREMENT_ID = 'G-ZKBGZCSKLN';

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const coords = { x: 0, y: 0 };
    const circles = this.el.nativeElement.querySelectorAll('.circle');
    const colors = ['#0067A3', '#9A74A1'];

    circles.forEach((circle: HTMLElement, index: number) => {
      (circle as any).x = 0;
      (circle as any).y = 0;
      this.renderer.setStyle(circle, 'background-color', colors[index % colors.length]);
    });

    window.addEventListener('mousemove', (e) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
    });

    const animateCircles = () => {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circle: HTMLElement, index: number) => {
        this.renderer.setStyle(circle, 'left', `${x - 12}px`);
        this.renderer.setStyle(circle, 'top', `${y - 12}px`);
        this.renderer.setStyle(circle, 'scale', `${(circles.length - index) / circles.length}`);

        (circle as any).x = x;
        (circle as any).y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += ((nextCircle as any).x - x) * 0.3;
        y += ((nextCircle as any).y - y) * 0.3;
      });

      requestAnimationFrame(animateCircles);
    };

    animateCircles();
  }

  ngOnInit(): void {
    // Eventos do cookie consent
    if (this.ccService) {
      this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
        console.log('Popup de cookies aberto!');
      });

      this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
        console.log('Popup de cookies fechado!');
      });
    }

    // Verifica se já há consentimento
    const consent = this.cookieService.get('cookie_consent');
    if (consent === 'allow') {
      this.gaService.loadScript(this.GA_MEASUREMENT_ID);
    }

    // Ouve alterações do consentimento
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe((event: NgcStatusChangeEvent) => {
      if (event.status === 'allow') {
        this.cookieService.set('cookie_consent', 'allow', { expires: 365 });
        this.gaService.loadScript(this.GA_MEASUREMENT_ID);
      }

      if (event.status === 'deny') {
        this.cookieService.set('cookie_consent', 'deny', { expires: 365 });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.popupOpenSubscription) this.popupOpenSubscription.unsubscribe();
    if (this.popupCloseSubscription) this.popupCloseSubscription.unsubscribe();
    if (this.statusChangeSubscription) this.statusChangeSubscription.unsubscribe();
  }
}
