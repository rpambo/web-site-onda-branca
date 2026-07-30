import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormQualidadeVida } from './form-qualidade-vida';
import { QualidadeDeVida } from '../../../services/qualidade-de-vida';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('FormQualidadeVida', () => {
  let component: FormQualidadeVida;
  let fixture: ComponentFixture<FormQualidadeVida>;
  let service: jasmine.SpyObj<QualidadeDeVida>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('QualidadeDeVida', ['sendEmail']);

    await TestBed.configureTestingModule({
      imports: [FormQualidadeVida, ReactiveFormsModule],
      providers: [
        { provide: QualidadeDeVida, useValue: serviceSpy }
      ]
    }).compileComponents();

    service = TestBed.inject(QualidadeDeVida) as jasmine.SpyObj<QualidadeDeVida>;

    fixture = TestBed.createComponent(FormQualidadeVida);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid', () => {
    expect(component.qualidadeVidaForm.valid).toBeFalse();
  });

  it('should validate email field', () => {
    const email = component.qualidadeVidaForm.get('email');

    email?.setValue('invalid');
    expect(email?.valid).toBeFalse();

    email?.setValue('valid@email.com');
    expect(email?.valid).toBeTrue();
  });

  it('should validate required personalGoal', () => {
    const goal = component.qualidadeVidaForm.get('personalGoal');

    goal?.setValue('');
    expect(goal?.valid).toBeFalse();

    goal?.setValue('This is a valid goal text');
    expect(goal?.valid).toBeTrue();
  });

  it('should reset form', () => {
    component.qualidadeVidaForm.patchValue({
      name: 'Rafael',
      email: 'rafael@email.com'
    });

    component.resetForm();

    expect(component.isSubmitted).toBeFalse();
  });

  it('should call service on submit', () => {
    service.sendEmail.and.returnValue(of({}));

    component.qualidadeVidaForm.patchValue({
      name: 'Rafael',
      email: 'rafael@email.com',
      contact: '123456',
      areasInterest: 'Bem-estar Físico (exercício, nutrição)',
      personalGoal: 'Objetivo válido aqui',
      frequencia: 'Semanal',
      experiencePrior: 'Alguma experiência',
      message: 'Mensagem válida suficiente'
    });

    component.onSubmit();

    expect(service.sendEmail).toHaveBeenCalled();
  });
});