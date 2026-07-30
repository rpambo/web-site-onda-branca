export interface contactService {
  name: string;
  email: string;
  servico: string;
  mensagem: string;
}

export interface reclamacao {
  name: string;
  email: string;
  message: string;
}

export interface emailMarketing {
  email: string;
}

export interface ProgramaSaudeMentalTrabalhador {
  name: string;
  email: string;
  contact: string;
  company: string;
  numberOfEmployees: number;
  serviceType: string;
  specificNeeds: string;
  message: string;
}

export interface P7MentoriaInterface {
  name: string;
  email: string;
  contact: string;
  participantType: string;
  company?: string;
  mainChallenges: string;
  mentoriaGoals: string;
  availability: string;
  message: string;
}

export interface QualidadeVidaInterface {
  name: string;
  email: string;
  contact: string;

  age?: number; // opcional

  areasInterest: string;
  personalGoal: string;

  frequencia: string;
  experiencePrior: string;

  message: string;
}

export interface GinasticaLaboralInterface {
  name: string;
  email: string;
  telefone: string;
  empresa: string;
  numeroFuncionarios: number;
  area: string;
  atividadePreferida: string;
  objetivos: string;
  frequencia: string;
  mensagem?: string;
}

export interface PalestraWorkshopInterface {
  name: string;
  email: string;
  contact: string;

  company: string;

  eventType: string;
  topic: string;

  audienceSize: number;
  location: string;
  eventDate: string;

  objective: string;

  message?: string;
}

export interface CoffeeBreak {
  included: boolean;
  type: string;
  people: number;
}

export interface SessaoEvento {
  id: number;
  reservaEventId: string;
  date: string;
  createdAt: string;
}

export interface GetSessoesResponse {
  data: {
    data: SessaoEvento[];
  };
}

export interface ReservaEventoRequest {
  name: string;
  email: string;
  contact: string;
  company: string;

  interestType: string;
  eventType: string;

  participants: number;

  dates: string[];

  coffeeBreak: CoffeeBreak;

  specificNeeds: string;
  message: string;
}