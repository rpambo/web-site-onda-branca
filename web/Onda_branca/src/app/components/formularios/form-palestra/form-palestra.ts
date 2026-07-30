import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PalestraWorkshopInterface } from '../../../interfaces';
import { Palestra } from '../../../services/palestra';


@Component({
  selector: 'app-form-palestra',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-palestra.html',
  styleUrl: './form-palestra.css'
})
export class FormPalestra {
 palestraWorkshopForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  tiposEvento = [
    'Palestra',
    'Workshop',
    'Formação Corporativa',
    'Programa Completo',
    'Outro'
  ];

  temasEvento = [
    'Saúde Mental no Trabalho',
    'Produtividade e Foco',
    'Liderança e Gestão de Equipas',
    'Inteligência Emocional',
    'Gestão de Stress e Burnout',
    'Personalizado'
  ];

  constructor(
    private fb: FormBuilder,
    private palestraWorkshopService: Palestra
  ) {
    this.palestraWorkshopForm = this.fb.group({

      // Dados pessoais
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],

      // Organização
      company: ['', [Validators.required, Validators.minLength(2)]],

      // Evento
      eventType: ['', Validators.required],
      topic: ['', Validators.required],

      // Logística
      audienceSize: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],

      // Conteúdo
      objective: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      message: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.palestraWorkshopForm.controls;
  }

  // -----------------------------
  // SEGURANÇA (anti-injection)
  // -----------------------------
  private detectMaliciousContent(text: string): boolean {
    if (!text) return false;

    const maliciousPatterns = [
      /<svg[\s\S]*?<\/svg>/gi,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /\son\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /data:image\/svg\+xml/gi,
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

  // -----------------------------
  // SUBMIT
  // -----------------------------
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.palestraWorkshopForm.invalid) {
      return;
    }

    const formValues = this.palestraWorkshopForm.value;

    const fieldsToCheck = [
      'name',
      'company',
      'objective',
      'message',
      'location'
    ];

    for (const field of fieldsToCheck) {
      if (this.detectMaliciousContent(formValues[field])) {
        Swal.fire({
          icon: 'error',
          title: 'Conteúdo inválido',
          text: 'O formulário contém conteúdo não permitido.'
        });
        return;
      }
    }

    this.isLoading = true;

    const sanitizedData: PalestraWorkshopInterface = {
      name: this.sanitizeInput(formValues.name),
      email: this.sanitizeInput(formValues.email),
      contact: this.sanitizeInput(formValues.contact),

      company: this.sanitizeInput(formValues.company),

      eventType: this.sanitizeInput(formValues.eventType),
      topic: this.sanitizeInput(formValues.topic),

      audienceSize: Number(formValues.audienceSize),

      location: this.sanitizeInput(formValues.location),
      eventDate: this.sanitizeInput(formValues.eventDate),

      objective: this.sanitizeInput(formValues.objective),

      message: this.sanitizeInput(formValues.message || '')
    };

    this.palestraWorkshopService.sendEmail(sanitizedData).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Pedido enviado com sucesso!',
          text: 'Entraremos em contacto em breve com uma proposta personalizada.',
          confirmButtonColor: '#006699'
        });

        this.palestraWorkshopForm.reset();
        this.isSubmitted = false;
      },

      error: (error) => {
        this.isLoading = false;
        console.error(error);

        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar',
          text: 'Não foi possível enviar o pedido. Tente novamente mais tarde.',
          confirmButtonColor: '#006699'
        });
      }
    });
  }

  // -----------------------------
  // RESET
  // -----------------------------
  resetForm(): void {
    this.palestraWorkshopForm.reset();
    this.isSubmitted = false;
  }
}
