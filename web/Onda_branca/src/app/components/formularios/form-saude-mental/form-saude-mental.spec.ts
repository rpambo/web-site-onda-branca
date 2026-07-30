import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSaudeMental } from './form-saude-mental';
import { ContactService } from '../../../services/contact-service';
import { ReactiveFormsModule } from '@angular/forms';

describe('FormSaudeMental', () => {
  let component: FormSaudeMental;
  let fixture: ComponentFixture<FormSaudeMental>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendContactForm']);

    await TestBed.configureTestingModule({
      imports: [FormSaudeMental, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    }).compileComponents();

    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture = TestBed.createComponent(FormSaudeMental);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.saudeMentalForm.get('name')?.value).toBe('');
    expect(component.saudeMentalForm.get('email')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.saudeMentalForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const emailControl = component.saudeMentalForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
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
    component.saudeMentalForm.patchValue({
      name: '',
      email: '',
      contact: '',
      company: '',
      numberOfEmployees: '',
      serviceType: ''
    });

    component.onSubmit();
    expect(component.isSubmitted).toBeTruthy();
    expect(contactService.sendContactForm).not.toHaveBeenCalled();
  });
});
