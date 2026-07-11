import {
  Component,
  EventEmitter,
  Output,
  signal,
  computed,
  OnInit,
  Injectable
} from '@angular/core';

import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    
  ]
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {

  
  providers = signal<Record<string, any>>({});
  selectedProvider = signal<string>('');
  form = signal<Record<string, string>>({});

  providerKeys = computed(() => Object.keys(this.providers()));
  fields = computed(() => {
    const p = this.providers()[this.selectedProvider()];
    return p?.credentials ?? [];
  });

  constructor(
    private auth: AuthService,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.auth.getProviders().subscribe((data: any) => {
      this.providers.set(data);
    });
  }

  onProviderChange(value: string) {
    this.selectedProvider.set(value);

    const cfg = this.providers()[value];
    const next: Record<string, string> = {};

    for (const f of cfg.credentials) {
      next[f.id] = '';
    }

    this.form.set(next);
  }

  updateField(id: string, value: string) {
    this.form.update(f => ({ ...f, [id]: value }));
  }

  doLogin() {
    const payload = {
      Provider: this.selectedProvider(),
      Module: 'dashboard',
      Fingerprint: { fingerprint: 'client-fp' },
      ...this.form()
    };

    this.auth.loginUnified(payload).subscribe({
      next: (res: any) => {
        this.session.setSession({
          user: res.user,
          roles: res.roles,
          token: res.token,
          provider: this.selectedProvider(),
          module: 'dashboard'
        });
        //this.close.emit();
      },
      error: () => {
        alert('Credenciales inválidas');
      }
    });
  }

  cancel() {
    //this.close.emit();
  }
}
