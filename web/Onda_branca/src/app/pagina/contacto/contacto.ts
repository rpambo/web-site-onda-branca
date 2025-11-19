import { Component, OnInit } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ContactService } from '../../services/contact-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  imports: [Navbar, Footer, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto implements OnInit {

  applyForm: FormGroup;
  isSumbit = false;
  hasMaliciousContent = false;
  securityMessage = '';
  isLoading = false;

  private allowedServices = [
    'Mentoria de saúde mental para gestores', 
    'Antendiemento a empresa', 
    'Gestão de programa de saúde mental para empresas', 
    'Renda extra', 
    'O programa de ginástica laboral', 
    'Palestra e workshops', 
    'Programa de saúde mental do trabalho'
  ];

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title,
    private serviceContact : ContactService
  ) {
    this.applyForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]+$')]],
      service: ['', [Validators.required, this.serviceValidator.bind(this)]],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit() {
    this.updateMetaTagsContacto();
  }

  // Atualiza meta tags para SEO, Open Graph e Twitter Cards
  updateMetaTagsContacto() {
    this.titleService.setTitle('Contacto | Onda Branca');

    // Meta padrão
    this.meta.updateTag({
      name: 'description',
      content: 'Entre em contacto com a Onda Branca para esclarecer dúvidas, solicitar serviços ou parcerias. Estamos disponíveis para ajudá-lo da melhor forma possível.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'contacto, serviços Onda Branca, mentoria, ginástica laboral, saúde mental, workshops, empresa'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Contacto | Onda Branca' });
    this.meta.updateTag({ property: 'og:description', content: 'Fale conosco e conheça todos os serviços da Onda Branca. Estamos aqui para apoiar você ou sua empresa.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://ondabranca.com/imagens/og-contacto.png' });
    this.meta.updateTag({ property: 'og:url', content: 'https://ondabranca.com/contacto' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Contacto | Onda Branca' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Entre em contacto com a Onda Branca e conheça nossos serviços de apoio, saúde mental e bem-estar.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://ondabranca.com/imagens/og-contacto.png' });
  }

  private serviceValidator(control: any) {
    if (!control.value) return null;
    const isValid = this.allowedServices.includes(control.value);
    return isValid ? null : { invalidService: true };
  }

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

      const nameCheck = this.detectMaliciousContent(rawData.name);
      const messageCheck = this.detectMaliciousContent(rawData.message);

      if (nameCheck.isMalicious || messageCheck.isMalicious) {
        this.hasMaliciousContent = true;

        const allPatterns = [...nameCheck.patterns, ...messageCheck.patterns];
        this.securityMessage = `Conteúdo de segurança detectado: ${allPatterns.join(', ')}. Por favor, remova este conteúdo e tente novamente.`;

        console.log('🚨 ENVIO BLOQUEADO - Conteúdo malicioso detectado:', {
          name: { malicious: nameCheck.isMalicious, patterns: nameCheck.patterns },
          message: { malicious: messageCheck.isMalicious, patterns: messageCheck.patterns }
        });

        const sanitizedData = {
          name: this.sanitizeForDisplay(rawData.fullName),
          email: rawData.email,
          contact: rawData.contact,
          service: rawData.service,
          message: this.sanitizeForDisplay(rawData.message)
        };
        console.log('🔍 Dados sanitizados (apenas visualização):', sanitizedData);

        return; // BLOQUEIA ENVIO
      }

      const cleanData = {
        name: rawData.name.trim(),
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
    this.isLoading = true
    this.serviceContact.sendContactForm(data).subscribe({
      next: (response) => {
        console.log('✅ Formulário enviado com sucesso:', response);
        Swal.fire({
          title: 'Mensagem enviada!',
          text: 'Entraremos em contato em breve.',
          icon: 'success',
          confirmButtonColor: '#006699',
          confirmButtonText: 'OK'
        });
        this.applyForm.reset();
        this.applyForm.get('service')?.setValue('');
        this.isSumbit = false;
        this.isLoading = false;
      },   
      error: (error) => {
        console.error('❌ Ocorreu um erro ao enviar o formulário:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Ocorreu um erro. Tente novamente mais tarde.',
          icon: 'error',
          confirmButtonColor: '#cc0000',
          confirmButtonText: 'OK'
        });
        this.applyForm.reset();
        this.applyForm.get('service')?.setValue('');
        this.isSumbit = false;
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.applyForm.controls;
  }
}