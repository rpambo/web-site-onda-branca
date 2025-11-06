import { Component, OnInit } from '@angular/core';
import { Footer } from "../../components/footer/footer";
import { Navbar } from "../../components/navbar/navbar";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reclamacao',
  imports: [Footer, Navbar, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './reclamacao.html',
  styleUrls: ['./reclamacao.css']
})
export class Reclamacao implements OnInit {
  applyForm: FormGroup;
  isSumbit = false;
  hasMaliciousContent = false;
  securityMessage = '';

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title
  ) {
    this.applyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit() {
    this.updateMetaTagsReclamacao();
  }

  // Atualiza meta tags para SEO, Open Graph e Twitter Cards
  updateMetaTagsReclamacao() {
    this.titleService.setTitle('Canal de Reclamações | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Envie sua reclamação, sugestão ou denúncia de forma segura e confidencial. Onda Branca valoriza a transparência e o respeito com todos os clientes e parceiros.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'canal de reclamações, queixa, denúncia, transparência, ética, Onda Branca'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Canal de Reclamações | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Registre aqui sua reclamação ou denúncia com segurança e confidencialidade.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-reclamacao.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/reclamacao' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Canal de Reclamações | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Envie sua reclamação ou denúncia de forma segura e confidencial.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-reclamacao.png' });
  }

  // Detecta conteúdo malicioso (XSS, scripts, SVGs, etc.)
  private detectMaliciousContent(text: string): { isMalicious: boolean; patterns: string[] } {
    if (!text) return { isMalicious: false, patterns: [] };

    const maliciousPatterns = [
      { pattern: /<svg[\s\S]*?<\/svg>/gi, name: 'Tag SVG' },
      { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, name: 'Tag Script' },
      { pattern: /\son\w+\s*=\s*["'][^"']*["']/gi, name: 'Event Handler' },
      { pattern: /javascript:/gi, name: 'Protocolo JavaScript' },
      { pattern: /vbscript:/gi, name: 'Protocolo VBScript' },
      { pattern: /data:text\/html/gi, name: 'Data URL HTML' },
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

  private sanitizeForDisplay(text: string): string {
    if (!text) return '';

    return text
      .replace(/<svg[\s\S]*?<\/svg>/gi, '🔒 [conteúdo bloqueado]')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '🔒 [script bloqueado]')
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

      const nameCheck = this.detectMaliciousContent(rawData.fullName);
      const messageCheck = this.detectMaliciousContent(rawData.message);

      if (nameCheck.isMalicious || messageCheck.isMalicious) {
        this.hasMaliciousContent = true;
        const allPatterns = [...nameCheck.patterns, ...messageCheck.patterns];
        this.securityMessage = `Conteúdo de segurança detectado: ${allPatterns.join(', ')}. Por favor, remova este conteúdo e tente novamente.`;

        console.log('🚨 ENVIO BLOQUEADO - Conteúdo malicioso detectado:', {
          fullName: { malicious: nameCheck.isMalicious, patterns: nameCheck.patterns },
          message: { malicious: messageCheck.isMalicious, patterns: messageCheck.patterns }
        });

        const sanitizedData = {
          fullName: this.sanitizeForDisplay(rawData.fullName),
          email: rawData.email,
          contact: rawData.contact,
          message: this.sanitizeForDisplay(rawData.message)
        };
        console.log('🔍 Dados sanitizados (visualização):', sanitizedData);

        return; // BLOQUEIA ENVIO
      }

      const cleanData = {
        fullName: rawData.fullName.trim(),
        email: rawData.email.trim(),
        contact: rawData.contact.replace(/[^\d+\-\s()]/g, ''),
        message: rawData.message.trim()
      };

      console.log('✅ Reclamação segura para envio:', cleanData);
      this.sendToBackend(cleanData);
    } else {
      console.log('❌ Formulário inválido - Erros de validação');
    }
  }

  private sendToBackend(data: any) {
    console.log('🛡️ ENVIANDO para backend - dados verificados e seguros:', data);

    // Aqui será adicionado o HttpClient real futuramente
    // this.http.post('/api/reclamacao', data).subscribe(...)

    this.applyForm.reset();
    this.isSumbit = false;
    alert('✅ Reclamação enviada com sucesso! A Onda Branca entrará em contacto em breve.');
  }

  get f() {
    return this.applyForm.controls;
  }
}