import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'ondasite.vercel.app',
    secure: true
  },
  
  position: 'top',
  theme: 'classic',
  palette: {
    popup: {
      background: '#fff',
      text: '#272727',
      link: '#c467bf'
    },
    button: {
      background: '#00479f',
      text: '#fff',
      border: '5px'
    }
  },
  type: 'opt-in',
  content: {
    message: 'Usamos cookies para melhorar sua experiência e analisar o tráfego.',
    dismiss: 'Aceitar',
    deny: 'Recusar',
    link: 'Saiba mais',
    href: '/politica-de-cookies',
    policy: 'Política de Cookies'
  },
  compliance: {
    optin: 'button button-primary',
    optout: 'button button-secondary'
  },
  autoOpen: true,
  
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(NgcCookieConsentModule.forRoot(cookieConfig)),
    CookieService
  ]
};