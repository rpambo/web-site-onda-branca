import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormP7Mentoria } from './form-p7-mentoria';
import { ContactService } from '../../../services/contact-service';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormP7Mentoria', () => {
  let component: FormP7Mentoria;
  let fixture: ComponentFixture<FormP7Mentoria>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendContactForm']);

    await TestBed.configureTestingModule({
      imports: [FormP7Mentoria, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    }).compileComponents();

    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture = TestBed.createComponent(FormP7Mentoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.p7MentoriaForm.get('name')?.value).toBe('');
    expect(component.p7MentoriaForm.get('email')?.value).toBe('');
    expect(component.p7MentoriaForm.get('participantType')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.p7MentoriaForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const emailControl = component.p7MentoriaForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone field', () => {
    const contactControl = component.p7MentoriaForm.get('contact');
    contactControl?.setValue('abc');
    expect(contactControl?.hasError('pattern')).toBeTruthy();

    contactControl?.setValue('+351 912 345 678');
    expect(contactControl?.hasError('pattern')).toBeFalsy();
  });

  it('should detect malicious content in text', () => {
    const maliciousText = '<script>alert("test")</script>';
    const result = component['detectMaliciousContent'](maliciousText);
    expect(result).toBeTruthy();
  });

  it('should sanitize input text', () => {
    const dirtyText = '<script>alert("test")</script>Hello';
    const sanitized = component['sanitizeInput'](dirtyText);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Hello');
  });

  it('should not submit invalid form', () => {
    component.isSubmitted = false;
    component.p7MentoriaForm.patchValue({
      name: '',
      email: '',
      contact: '',
      participantType: '',
      mainChallenges: ''
    });

    component.onSubmit();
    expect(component.isSubmitted).toBeTruthy();
    expect(contactService.sendContactForm).not.toHaveBeenCalled();
  });

  it('should have correct participant types', () => {
    expect(component.tiposParticipante.length).toBeGreaterThan(0);
    expect(component.tiposParticipante).toContain('Gestor/Diretor');
    expect(component.tiposParticipante).toContain('Profissional Independente');
  });

  it('should have correct challenges list', () => {
    expect(component.desafiosComuns.length).toBeGreaterThan(0);
    expect(component.desafiosComuns).toContain('Stress e Burnout');
    expect(component.desafiosComuns).toContain('Liderança e Gestão de Equipa');
  });
});
