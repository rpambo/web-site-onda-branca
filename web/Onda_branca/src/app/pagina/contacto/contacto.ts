import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [Navbar, Footer, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {

  applyForm: FormGroup;
  isSumbit = false;
  hasMaliciousContent = false;
  securityMessage = '';

  private allowedServices = [
    'mentoria-de-saude-mental-para-gestores', 
    'antendiemento-a-empresa', 
    'gestao-de-programa-de-saude-mental-para-empresa', 
    'renda-extra', 
    'o-programa-de-ginastica-laboral', 
    'palestra-e-workshops', 
    'programa-de-saude-mental-do-trabalho'
  ];

  constructor(private fb: FormBuilder) {
    this.applyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      service: ['', [Validators.required, this.serviceValidator.bind(this)]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  private serviceValidator(control: any) {
    if (!control.value) return null;
    const isValid = this.allowedServices.includes(control.value);
    return isValid ? null : { invalidService: true };
  }

  // ✅ **DETECTA conteúdo malicioso SEM remover**
  private detectMaliciousContent(text: string): { isMalicious: boolean; patterns: string[] } {
    if (!text) return { isMalicious: false, patterns: [] };

    const maliciousPatterns = [
      { pattern: /<svg[\s\S]*?<\/svg>/gi, name: 'Tag SVG' },
      { pattern: /<svg[\s\S]*?>/gi, name: 'Tag SVG aberta' },
      { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, name: 'Tag Script' },
      { pattern: /<script[\s\S]*?>/gi, name: 'Tag Script aberta' },
      { pattern: /\son\w+\s*=\s*["'][^"']*["']/gi, name: 'Event Handler' },
      { pattern: /\son\w+\s*=\s*[^"'\s][^\s>]*/gi, name: 'Event Handler sem aspas' },
      { pattern: /javascript:/gi, name: 'Protocolo JavaScript' },
      { pattern: /vbscript:/gi, name: 'Protocolo VBScript' },
      { pattern: /data:text\/html/gi, name: 'Data URL HTML' },
      { pattern: /data:image\/svg\+xml/gi, name: 'Data URL SVG' },
      { pattern: /<iframe[\s\S]*?<\/iframe>/gi, name: 'Tag Iframe' },
      { pattern: /<object[\s\S]*?<\/object>/gi, name: 'Tag Object' },
      { pattern: /<embed[\s\S]*?<\/embed>/gi, name: 'Tag Embed' }
    ];

    const detectedPatterns: string[] = [];

    maliciousPatterns.forEach(mp => {
      if (mp.pattern.test(text)) {
        detectedPatterns.push(mp.name);
      }
    });

    return {
      isMalicious: detectedPatterns.length > 0,
      patterns: detectedPatterns
    };
  }

  // ✅ **SANITIZA para exibição (mas não envia se detectar malicioso)**
  private sanitizeForDisplay(text: string): string {
    if (!text) return '';

    return text
      .replace(/<svg[\s\S]*?<\/svg>/gi, '🔒 [conteúdo bloqueado]')
      .replace(/<svg[\s\S]*?>/gi, '🔒 [conteúdo bloqueado]')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '🔒 [script bloqueado]')
      .replace(/<script[\s\S]*?>/gi, '🔒 [script bloqueado]')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim();
  }

  submiteForm() {
    this.isSumbit = true;
    this.hasMaliciousContent = false;
    this.securityMessage = '';

    if (this.applyForm.valid) {
      const rawData = this.applyForm.value;
      
      // ✅ **VERIFICAÇÃO DE SEGURANÇA - BLOQUEIO**
      const nameCheck = this.detectMaliciousContent(rawData.fullName);
      const messageCheck = this.detectMaliciousContent(rawData.message);

      if (nameCheck.isMalicious || messageCheck.isMalicious) {
        this.hasMaliciousContent = true;
        
        // Monta mensagem detalhada
        const allPatterns = [...nameCheck.patterns, ...messageCheck.patterns];
        this.securityMessage = `Conteúdo de segurança detectado: ${allPatterns.join(', ')}. Por favor, remova este conteúdo e tente novamente.`;
        
        console.log('🚨 ENVIO BLOQUEADO - Conteúdo malicioso detectado:', {
          fullName: { malicious: nameCheck.isMalicious, patterns: nameCheck.patterns },
          message: { malicious: messageCheck.isMalicious, patterns: messageCheck.patterns }
        });

        // Exibe dados sanitizados apenas para debug
        const sanitizedData = {
          fullName: this.sanitizeForDisplay(rawData.fullName),
          email: rawData.email,
          contact: rawData.contact,
          service: rawData.service,
          message: this.sanitizeForDisplay(rawData.message)
        };
        console.log('🔍 Dados sanitizados (apenas visualização):', sanitizedData);

        return; // ⛔ BLOQUEIA O ENVIO
      }

      // ✅ **SEGURANÇA CONFIRMADA - ENVIA DADOS**
      const cleanData = {
        fullName: rawData.fullName.trim(),
        email: rawData.email.trim(),
        contact: rawData.contact.replace(/[^\d+\-\s()]/g, ''),
        service: rawData.service,
        message: rawData.message.trim()
      };

      console.log('✅ Dados SEGUROS para envio:', cleanData);
      this.sendToBackend(cleanData);
      
    } else {
      console.log('❌ Formulário inválido - Erros de validação');
    }
  }

  private sendToBackend(data: any) {
    console.log('🛡️ ENVIANDO para backend - dados verificados e seguros:', data);
    
    // Aqui você implementa o HttpClient
    // this.http.post('/api/contact', data).subscribe(...)
    
    // Feedback para usuário
    this.applyForm.reset();
    this.isSumbit = false;
    alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.');
  }

  get f() {
    return this.applyForm.controls;
  }
}