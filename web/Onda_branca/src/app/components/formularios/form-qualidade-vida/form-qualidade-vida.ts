import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { QualidadeDeVida } from '../../../services/qualidade-de-vida';
import { QualidadeVidaInterface } from '../../../interfaces';

@Component({
  selector: 'app-form-qualidade-vida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-qualidade-vida.html',
  styleUrl: './form-qualidade-vida.css'
})
export class FormQualidadeVida implements OnInit {

  qualidadeVidaForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  areasInteresse = [
    'Bem-estar Físico (exercício, nutrição)',
    'Saúde Mental (stress, ansiedade)',
    'Equilíbrio Vida-Trabalho',
    'Desenvolvimento Pessoal',
    'Relacionamentos e Comunicação',
    'Gestão do Tempo e Produtividade',
    'Espiritualidade e Propósito',
    'Combinação de Tudo'
  ];

  frequenciaPreferida = [
    'Semanal',
    'Quinzenal',
    'Mensal',
    'Flexível conforme disponibilidade'
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: QualidadeDeVida
  ) {
    this.qualidadeVidaForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required]],
      age: [''],
      areasInterest: ['', Validators.required],
      personalGoal: ['', [Validators.required, Validators.minLength(10)]],
      frequencia: ['', Validators.required],
      experiencePrior: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.qualidadeVidaForm.controls;
  }

  private isSuspicious(text: string): boolean {
    if (!text) return false;

    return /<script|<iframe|javascript:|vbscript:|on\w+=/i.test(text);
  }

  private clean(text: string): string {
    if (!text) return '';
    return text.replace(/<[^>]*>?/g, '').trim();
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.qualidadeVidaForm.invalid) return;

    const v = this.qualidadeVidaForm.value;

    const riskyFields = [v.name, v.personalGoal, v.experiencePrior, v.message];

    if (riskyFields.some(this.isSuspicious)) {
      Swal.fire({
        icon: 'error',
        title: 'Conteúdo inválido',
        text: 'Por favor remove conteúdo não permitido.',
        confirmButtonColor: '#006699'
      });
      return;
    }

    this.isLoading = true;

    const data: QualidadeVidaInterface = {
      name: this.clean(v.name),
      email: v.email,
      contact: this.clean(v.contact),
      age: v.age ? Number(v.age) : undefined,
      areasInterest: v.areasInterest,
      personalGoal: this.clean(v.personalGoal),
      frequencia: v.frequencia,
      experiencePrior: this.clean(v.experiencePrior),
      message: this.clean(v.message)
    };

    this.contactService.sendEmail(data).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Inscrição realizada!',
          text: 'Entraremos em contacto em breve.',
          confirmButtonColor: '#006699'
        });

        this.qualidadeVidaForm.reset();
        this.isSubmitted = false;
      },

      error: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível enviar o formulário.',
          confirmButtonColor: '#006699'
        });
      }
    });
  }

  resetForm(): void {
    this.qualidadeVidaForm.reset();
    this.isSubmitted = false;
  }
}