import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Eventos } from '../../../services/eventos';
import { SessaoEvento, ReservaEventoRequest } from '../../../interfaces';

@Component({
  selector: 'app-form-evntos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-evntos.html',
  styleUrl: './form-evntos.css'
})

export class FormEvntos implements OnInit, AfterViewInit {
  @ViewChild('dataInput') dataInput!: ElementRef;

  eventoForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  minDate: string;

  // ─── Datas selecionadas ────────────────────────────────────────────────────
  datasSelecionadas: string[] = [];
  novaData = '';

  // ─── Datas já reservadas (vindos do back-end) ────────────────────────────
  datasReservadas: string[] = [];
  isLoadingSessoes = false;
  erroCarregarSessoes = false;

  // ─── Todas as datas desabilitadas ──────────────────────────────────────────
  todasDatasDesabilitadas: string[] = [];

  // Referência para o picker
  private flatpickrData: any = null;
  private isBrowser: boolean;
  private flatpickrLoaded = false;

  tiposInteresse = [
    'Divulgar minha marca/evento',
    'Alugar o espaço para evento',
    'Ambos'
  ];

  tiposEvento = [
    'Palestra', 'Workshop', 'Encontro/Networking',
    'Evento Corporativo', 'Lançamento de Produto', 'Outro'
  ];

  coffeeTipos = [
    { value: 'Coffee Break Simples (café, chá, água + bolacha)', label: 'Coffee Break Simples (café, chá, água + bolacha)' },
    { value: 'Coffee Break Completo (+ frutas, salgados, sucos)', label: 'Coffee Break Completo (+ frutas, salgados, sucos)' },
    { value: 'Almoço/Lanche Reforçado', label: 'Almoço/Lanche Reforçado' },
    { value: 'Personalizado (consultar)', label: 'Personalizado (consultar)' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventosService: Eventos,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    const hoje = new Date();
    this.minDate = hoje.toISOString().split('T')[0];

    this.eventoForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      company: ['', [Validators.required, Validators.minLength(3)]],
      interestType: ['', Validators.required],
      eventType: ['', Validators.required],
      participantes: ['', [Validators.required, Validators.min(5), Validators.max(200), Validators.pattern('^[0-9]+$')]],
      coffeeBreak: [false],
      coffeeTipo: ['Coffee Break Simples (café, chá, água + bolacha)'],
      coffeePessoas: ['', [Validators.pattern('^[0-9]+$')]],
      specificNeeds: ['', [Validators.maxLength(500)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.carregarSessoes();

    this.eventoForm.get('participantes')?.valueChanges.subscribe(value => {
      if (this.eventoForm.get('coffeeBreak')?.value && value) {
        this.eventoForm.patchValue({ coffeePessoas: value });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadFlatpickr();
    }
  }

  // ─── Carregar flatpickr dinamicamente ──────────────────────────────────────

  private loadFlatpickr(): void {
    if (this.flatpickrLoaded) {
      this.initFlatpickr();
      return;
    }

    import('flatpickr').then(module => {
      const flatpickr = module.default;
      (window as any).flatpickr = flatpickr;
      this.flatpickrLoaded = true;
      
      return import('flatpickr/dist/l10n/pt').then(() => {
        this.initFlatpickr();
      });
    }).catch(err => {
      console.error('Erro ao carregar flatpickr:', err);
    });
  }

  get f() {
    return this.eventoForm.controls;
  }

  // ─── Atualizar lista de todas as datas desabilitadas ──────────────────────

  atualizarDatasDesabilitadas(): void {
    const desabilitadas = [...this.datasReservadas, ...this.datasSelecionadas];
    this.todasDatasDesabilitadas = [...new Set(desabilitadas)];
    this.refreshFlatpickr();
    // console.log('📅 Todas as datas desabilitadas:', this.todasDatasDesabilitadas);
  }

  // ─── Verificar se uma data está desabilitada ──────────────────────────────

  isDataDesabilitada(data: string): boolean {
    if (!data) return false;
    const dataComparar = data.split('T')[0];
    return this.todasDatasDesabilitadas.some(d => d === dataComparar);
  }

  // ─── Inicializar Flatpickr ──────────────────────────────────────────────────

  initFlatpickr(): void {
    if (!this.isBrowser) return;

    const flatpickr = (window as any).flatpickr;
    if (!flatpickr) {
      console.warn('Flatpickr não está disponível.');
      return;
    }

    const input = this.dataInput?.nativeElement || document.getElementById('dataSelecionada') as HTMLInputElement;
    if (!input) {
      console.warn('Elemento do flatpickr não encontrado');
      return;
    }

    if (this.flatpickrData) {
      this.flatpickrData.destroy();
      this.flatpickrData = null;
    }

    const ptLocale = (window as any).Portuguese || {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        longhand: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      },
      months: {
        shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      }
    };

    this.flatpickrData = flatpickr(input, {
      locale: ptLocale,
      dateFormat: 'Y-m-d',
      minDate: this.minDate,
      disable: this.todasDatasDesabilitadas,
      allowInput: false,
      disableMobile: true,
      onChange: (selectedDates: Date[], dateStr: string) => {
        this.novaData = dateStr;
      }
    });

    console.log('✅ Flatpickr inicializado com sucesso');
  }

  // ─── Recarregar flatpickr ──────────────────────────────────────────────────

  refreshFlatpickr(): void {
    if (!this.isBrowser) return;
    
    try {
      if (this.flatpickrData) {
        this.flatpickrData.set('disable', this.todasDatasDesabilitadas);
      }
    } catch (error) {
      console.warn('Erro ao atualizar flatpickr:', error);
    }
  }

  // ─── Carregar sessões do back-end ───────────────────────────────────────────

  carregarSessoes(): void {
    this.isLoadingSessoes = true;
    this.erroCarregarSessoes = false;
    
    this.eventosService.getAllSessoes().subscribe({
      next: (sessoes: SessaoEvento[]) => {
        try {
          if (!sessoes || sessoes.length === 0) {
            this.datasReservadas = [];
            this.atualizarDatasDesabilitadas();
            this.isLoadingSessoes = false;
            return;
          }

          // Extrai as datas reservadas (agora `date` já vem como string)
          this.datasReservadas = sessoes
            .map(s => s?.date ? s.date.split('T')[0] : '')
            .filter(d => d !== '');

          // Remove duplicatas
          this.datasReservadas = [...new Set(this.datasReservadas)];

          this.atualizarDatasDesabilitadas();

        } catch (error) {
          console.error('❌ Erro ao processar resposta:', error);
          this.datasReservadas = [];
          this.atualizarDatasDesabilitadas();
        } finally {
          this.isLoadingSessoes = false;
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar sessões:', error);
        this.isLoadingSessoes = false;
        this.erroCarregarSessoes = true;

        if (error.status === 500) {
          this.datasReservadas = [];
          this.atualizarDatasDesabilitadas();

          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Não foi possível carregar as datas indisponíveis no momento. Você pode continuar, e nossa equipe verificará a disponibilidade.',
            confirmButtonColor: '#006699',
            confirmButtonText: 'Entendi'
          });
        } else if (error.status !== 404 && error.status !== 204) {
          Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Não foi possível carregar as datas disponíveis. Por favor, tente novamente ou continue com sua solicitação.',
            confirmButtonColor: '#006699',
            confirmButtonText: 'Continuar'
          });
          this.datasReservadas = [];
          this.atualizarDatasDesabilitadas();
        } else {
          this.datasReservadas = [];
          this.atualizarDatasDesabilitadas();
        }
      }
    });
  }

  // ─── Verificação de reserva ─────────────────────────────────────────────────

  isDataReservada(data: string): boolean {
    if (!data) return false;
    const dataComparar = data.split('T')[0];
    return this.datasReservadas.some(d => d === dataComparar);
  }

  // ─── Adicionar Data ─────────────────────────────────────────────────────────

  adicionarData(): void {
    if (!this.novaData) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Data não selecionada', 
        text: 'Por favor, selecione uma data no calendário.',
        confirmButtonColor: '#006699' 
      });
      return;
    }

    if (this.datasSelecionadas.includes(this.novaData)) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Data duplicada', 
        text: 'Esta data já foi adicionada.',
        confirmButtonColor: '#006699' 
      });
      return;
    }

    this.datasSelecionadas.push(this.novaData);
    this.datasSelecionadas.sort();
    this.atualizarDatasDesabilitadas();
    
    this.novaData = '';
    if (this.flatpickrData) {
      this.flatpickrData.clear();
    }
  }

  removerData(index: number): void {
    this.datasSelecionadas.splice(index, 1);
    this.atualizarDatasDesabilitadas();
  }

  // ─── Coffee Break ───────────────────────────────────────────────────────────

  onCoffeeBreakChange(event: any): void {
    if (!event.target.checked) {
      this.eventoForm.patchValue({ coffeeTipo: 'simples', coffeePessoas: '' });
    } else {
      const participantes = this.eventoForm.get('participantes')?.value;
      if (participantes) {
        this.eventoForm.patchValue({ coffeePessoas: participantes });
      }
    }
  }

  // ─── Segurança ──────────────────────────────────────────────────────────────

  private detectMaliciousContent(text: string): boolean {
    if (!text) return false;
    const maliciousPatterns = [
      /<svg[\s\S]*?<\/svg>/gi,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /\son\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi, /vbscript:/gi,
      /data:text\/html/gi, /data:image\/svg\+xml/gi,
      /<iframe[\s\S]*?<\/iframe>/gi,
      /<object[\s\S]*?<\/object>/gi,
      /<embed[\s\S]*?<\/embed>/gi
    ];
    return maliciousPatterns.some(pattern => pattern.test(text));
  }

  private sanitizeInput(text: string): string {
    if (!text) return '';
    return text
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim();
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.datasSelecionadas.length === 0 || this.eventoForm.invalid) {
      return;
    }

    const formValues = this.eventoForm.value;
    const fieldsToCheck = ['name', 'company', 'message', 'specificNeeds'];
    for (const field of fieldsToCheck) {
      if (this.detectMaliciousContent(formValues[field])) {
        Swal.fire({
          icon: 'error',
          title: 'Conteúdo inválido',
          text: 'Por favor, não insira código ou scripts nos campos.',
          confirmButtonColor: '#006699'
        });
        return;
      }
    }

    this.isLoading = true;

    const reservaRequest: ReservaEventoRequest = {
      name: this.sanitizeInput(formValues.name),
      email: this.sanitizeInput(formValues.email),
      contact: formValues.contact,
      company: this.sanitizeInput(formValues.company),

      interestType: formValues.interestType,
      eventType: formValues.eventType,

      participants: Number(formValues.participantes),

      dates: this.datasSelecionadas,

      coffeeBreak: {
        included: !!formValues.coffeeBreak,
        type: formValues.coffeeBreak
          ? (this.coffeeTipos.find(c => c.value === formValues.coffeeTipo)?.value || formValues.coffeeTipo)
          : '',
        people: formValues.coffeeBreak ? (Number(formValues.coffeePessoas) || 0) : 0
      },

      specificNeeds: this.sanitizeInput(formValues.specificNeeds || ''),
      message: this.sanitizeInput(formValues.message)
    };

    this.eventosService.create(reservaRequest).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Proposta Enviada!',
          text: 'Obrigado! Entraremos em contacto em breve para confirmar a disponibilidade e discutir os detalhes do seu evento.',
          confirmButtonColor: '#006699'
        });
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao enviar formulário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar',
          text: 'Não foi possível enviar sua proposta. Por favor, tente novamente.',
          confirmButtonColor: '#006699'
        });
      }
    });
  }

  // ─── Reset ──────────────────────────────────────────────────────────────────

  resetForm(): void {
    this.eventoForm.reset({
      coffeeBreak: false,
      coffeeTipo: 'simples',
      coffeePessoas: '',
      specificNeeds: '',
      message: ''
    });
    this.datasSelecionadas = [];
    this.novaData = '';
    this.isSubmitted = false;
    
    this.atualizarDatasDesabilitadas();
    
    if (this.isBrowser && this.flatpickrData) {
      this.flatpickrData.clear();
      this.flatpickrData.set('minDate', this.minDate);
    }
  }
}