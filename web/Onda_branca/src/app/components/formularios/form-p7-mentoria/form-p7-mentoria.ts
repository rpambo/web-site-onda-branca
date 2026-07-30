import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProgramaSaudeMentalTrabalhadorServiceSete } from '../../../services/programa-saude-mental-trabalhador-service-sete';
import { P7MentoriaInterface } from '../../../interfaces';

@Component({
  selector: 'app-form-p7-mentoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-p7-mentoria.html',
  styleUrl: './form-p7-mentoria.css'
})
export class FormP7Mentoria implements OnInit {
  
  p7MentoriaForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  
  tiposParticipante = [
    'Gestor/Diretor',
    'Coordenador/Supervisor',
    'Profissional Independente',
    'Colaborador',
    'Empreendedor',
    'Outro'
  ];

  desafiosComuns = [
    'Stress e Burnout',
    'Comunicação e Relacionamentos',
    'Liderança e Gestão de Equipa',
    'Equilíbrio Vida-Trabalho',
    'Autoestima e Confiança',
    'Gestão de Emoções'
  ];

  constructor(
    private fb: FormBuilder,
    private p7programService: ProgramaSaudeMentalTrabalhadorServiceSete,
  ) {
    this.p7MentoriaForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      participantType: ['', Validators.required],
      company: ['', [Validators.minLength(3)]],
      mainChallenges: ['', Validators.required],
      mentoriaGoals: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      availability: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.p7MentoriaForm.controls;
  }

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

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.p7MentoriaForm.invalid) {
      
      return;
    }

    // Verificar conteúdo malicioso
    const formValues = this.p7MentoriaForm.value;
    const fieldsToCheck = ['name', 'company', 'mentoriaGoals', 'message'];
    
    for (const field of fieldsToCheck) {
      if (this.detectMaliciousContent(formValues[field])) {
       
        return;
      }
    }

    this.isLoading = true;
    const sanitizedData: P7MentoriaInterface = {
    name: this.sanitizeInput(formValues.name),
    email: this.sanitizeInput(formValues.email),
    contact: this.sanitizeInput(formValues.contact),
    participantType: this.sanitizeInput(formValues.participantType),
    company: this.sanitizeInput(formValues.company || ''),
    mainChallenges: this.sanitizeInput(formValues.mainChallenges),
    mentoriaGoals: this.sanitizeInput(formValues.mentoriaGoals),
    availability: this.sanitizeInput(formValues.availability),
    message: this.sanitizeInput(formValues.message)
};

this.p7programService.sendEmail(sanitizedData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Inscrição Enviada!',
          text: 'Obrigado! Entraremos em contacto em breve para agendar sua mentoria personalizada.',
          confirmButtonColor: '#006699'
        });
        this.p7MentoriaForm.reset();
        this.isSubmitted = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao enviar formulário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao Enviar',
          text: 'Ocorreu um problema ao enviar o formulário. Por favor, tente novamente mais tarde.',
          confirmButtonColor: '#006699'
        });
      }
    });
  }

  resetForm(): void {
    this.p7MentoriaForm.reset();
    this.isSubmitted = false;
  }
}