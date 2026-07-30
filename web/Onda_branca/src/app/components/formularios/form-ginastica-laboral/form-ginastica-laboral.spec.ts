import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGinasticaLaboral } from './form-ginastica-laboral';
import { ContactService } from '../../../services/contact-service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('FormGinasticaLaboral', () => {
  let component: FormGinasticaLaboral;
  let fixture: ComponentFixture<FormGinasticaLaboral>;
  let mockContactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['sendContactForm']);

    await TestBed.configureTestingModule({
      imports: [FormGinasticaLaboral, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: mockContactService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormGinasticaLaboral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('atividadePreferida')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      name: 'João Silva',
      email: 'joao@empresa.com',
      telefone: '+351 910 123 456',
      empresa: 'Tech Company',
      numeroFuncionarios: 50,
      area: 'RH',
      atividadePreferida: 'Alongamento e Flexibilidade',
      objetivos: 'Reduzir dores nas costas/pescoço',
      frequencia: 'Diária (5 dias por semana)'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone format', () => {
    const phoneControl = component.form.get('telefone');
    
    phoneControl?.setValue('123');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();

    phoneControl?.setValue('+351 910 123 456');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should detect malicious content (script tags)', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    expect(component['detectMaliciousContent'](maliciousInput)).toBeTruthy();
  });

  it('should detect malicious content (javascript protocol)', () => {
    const maliciousInput = 'javascript: void(0)';
    expect(component['detectMaliciousContent'](maliciousInput)).toBeTruthy();
  });

  it('should detect malicious content (event handlers)', () => {
    const maliciousInput = '<img onerror="alert(1)">';
    expect(component['detectMaliciousContent'](maliciousInput)).toBeTruthy();
  });

  it('should sanitize input by removing script tags', () => {
    const input = '<script>alert("XSS")</script>Hello';
    const sanitized = component['sanitizeInput'](input);
    expect(sanitized).toBe('Hello');
  });

  it('should sanitize input by removing event handlers', () => {
    const input = '<img onerror="alert(1)"> Image';
    const sanitized = component['sanitizeInput'](input);
    expect(sanitized).not.toContain('onerror');
  });

  it('should call sendContactForm on valid form submission', (done) => {
    mockContactService.sendContactForm.and.returnValue(of({}));

    component.form.patchValue({
      name: 'João Silva',
      email: 'joao@empresa.com',
      telefone: '+351 910 123 456',
      empresa: 'Tech Company',
      numeroFuncionarios: 50,
      area: 'RH',
      atividadePreferida: 'Alongamento e Flexibilidade',
      objetivos: 'Reduzir dores nas costas/pescoço',
      frequencia: 'Diária (5 dias por semana)',
      mensagem: 'Este é um teste de envio'
    });

    spyOn(Swal, 'fire');
    component.onSubmit();

    setTimeout(() => {
      expect(mockContactService.sendContactForm).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        'Sucesso! 💪',
        jasmine.any(String),
        'success'
      );
      done();
    }, 100);
  });

  it('should show error alert on form submission failure', (done) => {
    mockContactService.sendContactForm.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.form.patchValue({
      name: 'João Silva',
      email: 'joao@empresa.com',
      telefone: '+351 910 123 456',
      empresa: 'Tech Company',
      numeroFuncionarios: 50,
      area: 'RH',
      atividadePreferida: 'Alongamento e Flexibilidade',
      objetivos: 'Reduzir dores nas costas/pescoço',
      frequencia: 'Diária (5 dias por semana)',
      mensagem: 'Este é um teste de envio'
    });

    spyOn(Swal, 'fire');
    component.onSubmit();

    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Erro',
        jasmine.any(String),
        'error'
      );
      done();
    }, 100);
  });

  it('should not submit if form is invalid', () => {
    spyOn(Swal, 'fire');
    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Erro',
      jasmine.any(String),
      'error'
    );
    expect(mockContactService.sendContactForm).not.toHaveBeenCalled();
  });

  it('should prevent submission with malicious content', () => {
    spyOn(Swal, 'fire');

    component.form.patchValue({
      name: '<script>alert("XSS")</script>',
      email: 'joao@empresa.com',
      telefone: '+351 910 123 456',
      empresa: 'Tech Company',
      numeroFuncionarios: 50,
      area: 'RH',
      atividadePreferida: 'Alongamento e Flexibilidade',
      objetivos: 'Reduzir dores nas costas/pescoço',
      frequencia: 'Diária (5 dias por semana)',
      mensagem: 'Teste válido'
    });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Segurança',
      jasmine.any(String),
      'warning'
    );
  });

  it('should reset form after successful submission', (done) => {
    mockContactService.sendContactForm.and.returnValue(of({}));

    component.form.patchValue({
      name: 'João Silva',
      email: 'joao@empresa.com',
      telefone: '+351 910 123 456',
      empresa: 'Tech Company',
      numeroFuncionarios: 50,
      area: 'RH',
      atividadePreferida: 'Alongamento e Flexibilidade',
      objetivos: 'Reduzir dores nas costas/pescoço',
      frequencia: 'Diária (5 dias por semana)',
      mensagem: 'Teste'
    });

    spyOn(Swal, 'fire');
    component.onSubmit();

    setTimeout(() => {
      expect(component.form.get('name')?.value).toBeNull();
      expect(component.submitted).toBeFalsy();
      done();
    }, 100);
  });
});
