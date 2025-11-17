import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EmailMarketing } from '../../../services/email-marketing';

@Component({
  selector: 'app-bruchura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bruchura.html',
  styleUrls: ['./bruchura.css']
})
export class Bruchura {
  form: FormGroup;
  isSubmit = false;
  isLoading = false;
  hasMaliciousContent = false;
  securityMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: EmailMarketing
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // XSS Detection — Para campo email (caso tentem injetar SVG, script, etc.)
  private detectMaliciousContent(text: string): { isMalicious: boolean; patterns: string[] } {
    if (!text) return { isMalicious: false, patterns: [] };

    const patterns = [
      { pattern: /<svg[\s\S]*?<\/svg>/gi, name: 'SVG' },
      { pattern: /<script[\s\S]*?<\/script>/gi, name: 'Script' },
      { pattern: /\son\w+=/gi, name: 'Event Handler (onClick, onError...)' },
      { pattern: /javascript:/gi, name: 'JavaScript URL' },
      { pattern: /vbscript:/gi, name: 'VBScript URL' },
      { pattern: /<iframe[\s\S]*?<\/iframe>/gi, name: 'Iframe' }
    ];

    const detected: string[] = [];
    patterns.forEach(p => {
      if (p.pattern.test(text)) detected.push(p.name);
    });

    return { isMalicious: detected.length > 0, patterns: detected };
  }

  // Sanitização para visualização em logs
  private sanitizeForDisplay(text: string): string {
    return text
      .replace(/<script[\s\S]*?<\/script>/gi, '[script removido]')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '[svg removido]')
      .replace(/\son\w+=/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
  
  submitForm() {
    this.isSubmit = true;
    this.hasMaliciousContent = false;
    this.securityMessage = '';

    if (!this.form.valid) return;

    const rawEmail = this.form.value.email;

    // XSS Check
    const check = this.detectMaliciousContent(rawEmail);
    if (check.isMalicious) {
      this.hasMaliciousContent = true;
      this.securityMessage = `Conteúdo malicioso detectado: ${check.patterns.join(', ')}`;

      console.log('🚨 BLOQUEADO por XSS:', {
        raw: rawEmail,
        sanitized: this.sanitizeForDisplay(rawEmail),
        threats: check.patterns
      });

      return;
    }

    // Clean email
    const data = { email: rawEmail.trim() };

    console.log('📨 Email seguro para envio:', data);
    this.sendToBackend(data);
  }

  private sendToBackend(data: any) {
    this.isLoading = true;
    this.service.sendEmailMarketing(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Subscrição realizada!',
          text: 'A brochura será enviada para o seu e-mail em instantes.',
          icon: 'success',
          confirmButtonColor: '#006699'
        });
        this.form.reset();
        this.isLoading = false;
        this.isSubmit = false;
      },
      error: () => {
        Swal.fire({
          title: 'Erro ao enviar',
          text: 'Ocorreu um problema. Tente novamente.',
          icon: 'error',
          confirmButtonColor: '#cc0000'
        });
        this.isLoading = false;
        this.isSubmit = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }
}