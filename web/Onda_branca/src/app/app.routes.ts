import { Routes } from '@angular/router';
import { Home } from './pagina/home/home';
import { Contacto } from './pagina/contacto/contacto';
import { RendaExtra } from './pagina/renda-extra/renda-extra';
import { ProgramaGinasticaLaboral } from './pagina/programa-ginastica-laboral/programa-ginastica-laboral';
import { PalestraEWorkshop } from './pagina/palestra-e-workshop/palestra-e-workshop';
import { ProgramaDeSaudeMental } from './pagina/programa-de-saude-mental/programa-de-saude-mental';
import { PoliticaPrivacidade } from './components/politica-privacidade/politica-privacidade';
import { TermoDeUso } from './components/termo-de-uso/termo-de-uso';
import { Reclamacao } from './pagina/canal-de-reclamacao/reclamacao';
import { P7Mentoria } from './pagina/p7-mentoria/p7-mentoria';
import { Eventos } from './pagina/eventos/eventos';
import { ReservaConfirmada } from './pagina/reserva-confirmada/reserva-confirmada';
import { ReservaCancelada } from './pagina/reserva-cancelada/reserva-cancelada';
import { ReservaInvalida } from './pagina/reserva-invalida/reserva-invalida';
import { PageNotFound } from './pagina/page-not-found/page-not-found';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'programa-de-saude-emocional-do-trabalhador-mentoria', component: P7Mentoria },
  { path: 'contacto', component: Contacto },
  { path: 'espaco-de-eventos', component: Eventos },
  { path: 'canal-de-reclamacao', component: Reclamacao },

  // Rotas separadas (não aninhadas)
  { path: 'palestra-e-workshop', component: PalestraEWorkshop },
  
  { path: 'projecto-de-qualidade-de-vida', component: RendaExtra },
  { path: 'programa-de-ginastica-laboral', component: ProgramaGinasticaLaboral },
  { path: 'programa-de-saude-emocional-do-trabalhador', component: ProgramaDeSaudeMental },

  { path: 'politica-de-privacidade', component: PoliticaPrivacidade },
  { path: 'termo-de-uso', component: TermoDeUso },

  // ===== Reserva de Eventos =====
  { path: 'reserva/confirmada', component: ReservaConfirmada },
  { path: 'reserva/cancelada', component: ReservaCancelada},
  { path: 'reserva/invalida', component: ReservaInvalida },

  // Página 404
  { path: '**', component: PageNotFound }
];