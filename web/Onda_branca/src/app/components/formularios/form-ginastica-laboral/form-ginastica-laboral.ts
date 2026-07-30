import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GinasticaLaboral } from '../../../services/ginastica-laboral';
import { GinasticaLaboralInterface } from '../../../interfaces';

@Component({
  selector: 'app-form-ginastica-laboral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-ginastica-laboral.html',
  styleUrl: './form-ginastica-laboral.css'
})

export class FormGinasticaLaboral implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;

  // Opcões de atividades físicas
  atividadesPreferidas = [
    'Alongamento e Flexibilidade',
    'Fortalecimento Muscular',
    'Exercícios Aeróbicos Leves',
    'Relaxamento e Respiração',
    'Combinação de Tudo',
    'Não tenho preferência'
  ];

  // Objetivos da ginástica laboral
  objetivosGinastica = [
    'Reduzir dores nas costas/pescoço',
    'Aumentar energia e foco',
    'Prevenir lesões',
    'Melhorar postura',
    'Reduzir stress',
    'Integração entre colaboradores',
    'Múltiplos objetivos'
  ];

  // Frequência desejada
  frequenciaDesejada = [
    'Diária (5 dias por semana)',
    '3 vezes por semana',
    '2 vezes por semana',
    '1 vez por semana',
    'Conforme necessário'
  ];

  constructor(private formBuilder: FormBuilder, private contactService: GinasticaLaboral) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{9,}$/)]],
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      numeroFuncionarios: ['', [Validators.required, Validators.min(1)]],
      area: ['', Validators.required],
      atividadePreferida: ['', Validators.required],
      objetivos: ['', Validators.required],
      frequencia: ['', Validators.required],
      mensagem: ['', [Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  get f() {
    return this.form.controls;
  }

  private detectMaliciousContent(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /eval\(/gi,
      /expression\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe/gi, '&lt;iframe')
      .replace(/<object/gi, '&lt;object')
      .replace(/<embed/gi, '&lt;embed')
      .trim();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    // Validação de segurança XSS
    const formValues = this.form.value;
    for (const key in formValues) {
      if (formValues[key] && typeof formValues[key] === 'string') {
        if (this.detectMaliciousContent(formValues[key])) {
          return;
        }
        formValues[key] = this.sanitizeInput(formValues[key]);
      }
    }

    this.loading = true;

    const sanitizedData: GinasticaLaboralInterface = {
    name: this.sanitizeInput(formValues.name),
    email: this.sanitizeInput(formValues.email),
    telefone: this.sanitizeInput(formValues.telefone),
    empresa: this.sanitizeInput(formValues.empresa),
    numeroFuncionarios: Number(formValues.numeroFuncionarios),
    area: this.sanitizeInput(formValues.area),
    atividadePreferida: this.sanitizeInput(formValues.atividadePreferida),
    objetivos: this.sanitizeInput(formValues.objetivos),
    frequencia: this.sanitizeInput(formValues.frequencia),
    mensagem: this.sanitizeInput(formValues.mensagem || '')
  };

    this.contactService.sendEmail(sanitizedData).subscribe(
      (response) => {
        this.loading = false;
        Swal.fire(
          'Sucesso! ',
          'Bem-vindo ao Programa de Ginástica Laboral! Entraremos em contacto em breve para personalizar o programa da sua empresa.',
          'success'
        );
        this.form.reset();
        this.submitted = false;
      },
      (error) => {
        this.loading = false;
        console.error('Erro ao enviar formulário:', error);
        Swal.fire('Erro', 'Ocorreu um erro ao enviar o formulário. Tente novamente.', 'error');
      }
    );
  }
}
