# Code Examples: Revisao Pre-Deploy Angular

## Atualizacao do favicon no index.html

```html
<!-- Antes: favicon padrao do Angular -->
<link rel="icon" type="image/x-icon" href="favicon.ico">

<!-- Depois: logo do projeto -->
<link rel="icon" type="image/svg+xml" href="nave/logo.svg">
```

## Limpeza de componente com codigo de demonstracao

### Antes (com codigo de debug e demonstracao)

```typescript
import { Component, OnInit } from '@angular/core';
import { AlgumComponenteNaoUsado } from './algum-componente';

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
})
export class CertificadoComponent implements OnInit {
  message = 'teste de onInit';

  ngOnInit() {
    console.log(this.message);
  }

  gerarCertificado(nome: string, tecnologias: string[]) {
    console.log('gerando certificado', nome, tecnologias);
    // ... logica real
  }

  listarCertificados() {
    const certificados = this.service.getAll();
    console.log('certificados encontrados:', certificados);
    return certificados;
  }
}
```

### Depois (limpo para producao)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
})
export class CertificadoComponent {
  gerarCertificado(nome: string, tecnologias: string[]) {
    // ... logica real
  }

  listarCertificados() {
    return this.service.getAll();
  }
}
```

### O que foi removido e por que

| Item removido | Motivo |
|---------------|--------|
| `import { OnInit }` | Nao ha mais `ngOnInit` no componente |
| `implements OnInit` | Interface sem implementacao correspondente |
| `message = 'teste de onInit'` | Variavel usada apenas para debug |
| `ngOnInit()` | Metodo que so fazia console.log de teste |
| `import { AlgumComponenteNaoUsado }` | Componente que nao era referenciado no template |
| Todos os `console.log` | Codigo de debug que nao deve ir para producao |

## Busca global por console.log

No VS Code ou editor similar:
- `Ctrl+Shift+F` (Windows/Linux) ou `Cmd+Shift+F` (Mac)
- Digitar `console.log`
- Revisar cada ocorrencia e remover

```bash
# Via terminal, para confirmar que nao sobrou nenhum
grep -rn "console.log" src/ --include="*.ts"
```

## Teste final realizado pelo instrutor

```
1. Navegou para a pagina de geracao de certificado
2. Preencheu: Nome = "Rogerio Santos", Tecnologias = PHP, React, Angular
3. Clicou em "Gerar Certificado"
4. Certificado gerado instantaneamente
5. Clicou em "Download" → arquivo baixado com sucesso
6. Navegou para lista de certificados → certificado do Rogerio aparece em primeiro
7. Confirmou que aplicacao esta pronta para deploy
```