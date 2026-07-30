import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProgramaSaudeMentalTrabalhadorService } from '../../../services/programa-saude-mental-trabalhador-service';
import { ProgramaSaudeMentalTrabalhador } from '../../../interfaces';

@Component({
  selector: 'app-form-saude-mental',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-saude-mental.html',
  styleUrl: './form-saude-mental.css'
})
export class FormSaudeMental implements OnInit {
  
  saudeMentalForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  
  tiposServico = [
    'Consultoria Estratégica',
    'Workshops e Palestras',
    'Programa de Coaching',
    'Mentoria Executiva',
    'Programa Personalizado',
    'Não tenho certeza'
  ];

  constructor(
    private fb: FormBuilder,
    private programaSaudeMental: ProgramaSaudeMentalTrabalhadorService,
  ) {
    this.saudeMentalForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      company: ['', [Validators.required, Validators.minLength(3)]],
      numberOfEmployees: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      serviceType: ['', Validators.required],
      specificNeeds: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.saudeMentalForm.controls;
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

    if (this.saudeMentalForm.invalid) {

      return;
    }

    // Verificar conteúdo malicioso
    const formValues = this.saudeMentalForm.value;
    const fieldsToCheck = ['name', 'company', 'message', 'specificNeeds'];
    
    for (const field of fieldsToCheck) {
      if (this.detectMaliciousContent(formValues[field])) {
        return;
      }
    }

    this.isLoading = true;

    const sanitizedData: ProgramaSaudeMentalTrabalhador = {
    name: this.sanitizeInput(formValues.name),
    email: this.sanitizeInput(formValues.email),
    contact: this.sanitizeInput(formValues.contact),
    company: this.sanitizeInput(formValues.company),
    numberOfEmployees: Number(formValues.numberOfEmployees),
    serviceType: formValues.serviceType,
    specificNeeds: this.sanitizeInput(formValues.specificNeeds),
    message: this.sanitizeInput(formValues.message)
  };

    this.programaSaudeMental.sendEmail(sanitizedData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Proposta Enviada!',
          text: 'Obrigado! Entraremos em contacto em breve para discutir as melhores soluções para sua empresa.',
          confirmButtonColor: '#006699'
        });
        this.saudeMentalForm.reset();
        this.isSubmitted = false;
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
        icon: 'error',
        title: 'Erro ao Enviar',
        text: 'Não foi possível enviar a proposta neste momento. Por favor, tente novamente mais tarde.',
        confirmButtonColor: '#006699'
      });
      }
    });
  }

  resetForm(): void {
    this.saudeMentalForm.reset();
    this.isSubmitted = false;
  }
}
