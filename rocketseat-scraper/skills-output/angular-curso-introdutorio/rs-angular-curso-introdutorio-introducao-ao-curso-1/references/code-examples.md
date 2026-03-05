# Code Examples: Introducao ao Angular

## Nota

Esta aula e introdutoria e nao contem exemplos de codigo. Os exemplos abaixo ilustram a estrutura basica que sera explorada nas proximas aulas do curso.

## Estrutura tipica de um projeto Angular

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Componente raiz
│   │   ├── app.component.html      # Template do componente raiz
│   │   ├── app.component.css       # Estilos do componente raiz
│   │   ├── app.routes.ts           # Definicao de rotas
│   │   └── app.config.ts           # Configuracao da aplicacao
│   ├── index.html                   # HTML principal
│   ├── main.ts                      # Entry point
│   └── styles.css                   # Estilos globais
├── angular.json                     # Configuracao do Angular CLI
├── tsconfig.json                    # Configuracao TypeScript
└── package.json                     # Dependencias
```

## Anatomia basica de um componente

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-certificate-generator',
  standalone: true,
  template: `
    <h1>Gerador de Certificado</h1>
    <p>{{ userName }}</p>
  `,
  styles: [`
    h1 { color: #8257e5; }
  `]
})
export class CertificateGeneratorComponent {
  userName = 'Vinicius Barbosa';
}
```

## Anatomia basica de um servico

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  generateCertificate(name: string, course: string) {
    return {
      name,
      course,
      date: new Date(),
      id: crypto.randomUUID()
    };
  }
}
```

## Configuracao basica de rotas

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generate', component: GenerateComponent },
  { path: 'certificates', component: CertificateListComponent },
];
```

## Projeto do curso: Gerador de Certificados

O projeto pratico exercita todos os pilares:

| Pilar | Aplicacao no projeto |
|-------|---------------------|
| Estrutura | Organizacao de pastas por feature |
| Componentes | Formulario, preview, lista |
| Servicos | Geracao e armazenamento de certificados |
| Rotas | Navegacao entre formulario, preview e lista |