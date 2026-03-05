# Code Examples: O que e o Angular e Seu Proposito

## Nota sobre esta aula

Esta aula e introdutoria e conceitual — nao contem exemplos de codigo diretos. Os exemplos abaixo ilustram os conceitos mencionados pelo instrutor para dar contexto pratico ao que foi explicado.

## Arquitetura de camadas mencionada

### Frontend chamando Backend via HTTP
```typescript
// Angular HttpClient nativo (sem Axios)
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users');
  }

  createUser(user: CreateUserInput) {
    return this.http.post<User>('/api/users', user);
  }
}
```

## SPA — Navegacao sem recarregar

```typescript
// Roteamento Angular — usuario muda de tela sem perder contexto
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
];

// No template — navegacao SPA
// <a routerLink="/users">Usuarios</a>
// Ao clicar, a tela muda MAS a aplicacao NAO recarrega
```

## TypeScript — "JavaScript com superpoderes"

```typescript
// Tipagem de variaveis
const userName: string = 'João';
const userAge: number = 25;
const isActive: boolean = true;

// Interface para tipar objetos (response de API, por exemplo)
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Tipagem de response HTTP
this.http.get<User[]>('/api/users').subscribe(users => {
  // 'users' e tipado como User[] — facil visualizar o que o endpoint retorna
  console.log(users[0].name);
});
```

## Componente reutilizavel

```typescript
// Criar uma vez, usar em varios locais
@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
}

// Reutilizando em multiplos locais:
// <app-user-card [user]="admin" />
// <app-user-card [user]="currentUser" />
// <app-user-card [user]="selectedUser" />
```

## Formularios — ReactiveForms

```typescript
// Formulario reativo com validacoes complexas
@Component({ /* ... */ })
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  // Verificar se campo esta valido/invalido
  get isEmailInvalid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  onSubmit() {
    if (this.form.valid) {
      // enviar dados
    }
  }
}
```

## Interceptor HTTP — tratar requisicoes

```typescript
// Interceptar requisicoes para adicionar headers
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  const clonedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(clonedRequest);
};
```

## Compilacao — o que o navegador recebe

```
// Codigo Angular (o que voce escreve):
@Component({
  selector: 'app-root',
  template: `<h1>{{ title }}</h1>`
})
export class AppComponent {
  title: string = 'Minha App';
}

// O que o navegador recebe (compilado):
// → JavaScript puro (sem TypeScript, sem @Component)
// → HTML puro (sem template syntax)
// → CSS puro
```

## Bibliotecas externas via NPM

```bash
# Exemplos mencionados pelo instrutor
npm install tailwindcss    # Estilizacao
npm install date-fns       # Manipulacao de datas

# NAO necessario no Angular (ja tem nativo):
# npm install axios        # Angular tem HttpClient
# npm install react-router # Angular tem Router
# npm install formik       # Angular tem ReactiveForms
```