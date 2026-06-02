import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonInput,
  IonButton, IonIcon, IonSpinner, IonModal, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
         arrowForwardOutline, shieldCheckmarkOutline, alertCircleOutline, closeOutline,
         personOutline, businessOutline, keyOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { isInstitutionEmail } from '../../core/utils/validation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent,
            IonItem, IonInput, IonButton, IonIcon, IonSpinner, IonModal,
            IonSelect, IonSelectOption],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email        = '';
  password     = '';
  showPassword = false;
  isLoading    = false;
  loginError   = '';
  errors: Record<string, string> = {};
  isCreateUserModalOpen = false;

  // Form de crear usuario
  createUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: 'reportante' as 'reportante' | 'mantenimiento' | 'administrador',
    password: '' // ← Cada usuario ingresa su PROPIA contraseña
  };

  departments = [
    'Dirección',
    'Administración',
    'Mantenimiento',
    'Seguridad',
    'Servicios Generales',
    'Recursos Humanos'
  ];

  roles = [
    { label: 'Reportante', value: 'reportante' },
    { label: 'Mantenimiento', value: 'mantenimiento' },
    { label: 'Administrador', value: 'administrador' }
  ];

  createUserErrors: Record<string, string> = {};

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
               arrowForwardOutline, shieldCheckmarkOutline, alertCircleOutline, closeOutline,
               personOutline, businessOutline, keyOutline });
  }

  togglePassword() { 
    this.showPassword = !this.showPassword; 
  }

  onEmailInput(event: CustomEvent) {
    this.email = (event.detail as { value?: string }).value ?? '';
  }

  validate(): boolean {
    this.errors = {};
    if (!this.email.trim()) {
      this.errors['email'] = 'El correo es requerido.';
    } else if (!isInstitutionEmail(this.email)) {
      this.errors['email'] = 'Use el formato nombre@institucion.cr';
    }
    if (!this.password.trim()) {
      this.errors['password'] = 'La contraseña es requerida.';
    }
    return Object.keys(this.errors).length === 0;
  }

  async onLogin() {
    if (!this.validate()) return;
    this.isLoading   = true;
    this.loginError  = '';
    const result = await this.auth.login(this.email.trim(), this.password);
    this.isLoading = false;
    if (result.success) {
      (document.activeElement as HTMLElement)?.blur();
      await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } else {
      this.loginError = result.error ?? 'Error al iniciar sesión.';
    }
  }

  openCreateUserModal() {
    this.isCreateUserModalOpen = true;
    this.resetCreateUserForm();
  }

  closeCreateUserModal() {
    this.isCreateUserModalOpen = false;
    this.resetCreateUserForm();
  }

  resetCreateUserForm() {
    this.createUserForm = {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: 'reportante',
      password: ''
    };
    this.createUserErrors = {};
  }

  validateCreateUser(): boolean {
    this.createUserErrors = {};
    if (!this.createUserForm.firstName.trim()) 
      this.createUserErrors['firstName'] = 'El nombre es requerido.';
    if (!this.createUserForm.lastName.trim()) 
      this.createUserErrors['lastName'] = 'El apellido es requerido.';
    if (!this.createUserForm.email.trim()) 
      this.createUserErrors['email'] = 'El correo es requerido.';
    else if (!isInstitutionEmail(this.createUserForm.email))
      this.createUserErrors['email'] = 'Use el formato nombre@institucion.cr';
    if (!this.createUserForm.department) 
      this.createUserErrors['department'] = 'El departamento es requerido.';
    if (!this.createUserForm.password.trim()) 
      this.createUserErrors['password'] = 'La contraseña es requerida.';
    else if (!this.createUserForm.password.startsWith('Report') || this.createUserForm.password.length < 11) // ← Validación de contraseña
      this.createUserErrors['password'] = 'La contraseña debe ser: Report##### (donde # son 6 números)';
    
    return Object.keys(this.createUserErrors).length === 0;
  }

  // Nota: Cada usuario ingresa su PROPIA contraseña al crear su cuenta, siguiendo el formato "Report123456".
  async onCreateUser() {
    if (!this.validateCreateUser()) return;

    const result = await this.auth.registerUser(
      {
        name: `${this.createUserForm.firstName.trim()} ${this.createUserForm.lastName.trim()}`,
        email: this.createUserForm.email.trim(),
        department: this.createUserForm.department,
        role: this.createUserForm.role,
      },
      this.createUserForm.password
    );

    if (!result.success) {
      this.createUserErrors['email'] = result.error ?? 'No se pudo crear el usuario.';
      return;
    }

    const savedEmail = this.createUserForm.email.trim();
    const savedPassword = this.createUserForm.password;
    this.closeCreateUserModal();
    this.loginError = 'Usuario creado exitosamente. Ya puedes iniciar sesión.';
    this.email = savedEmail;
    this.password = savedPassword;
  }
}
