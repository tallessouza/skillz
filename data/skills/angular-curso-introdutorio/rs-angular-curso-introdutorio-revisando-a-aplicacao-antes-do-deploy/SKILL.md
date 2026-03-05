---
name: rs-angular-intro-revisao-pre-deploy
description: "Enforces pre-deploy cleanup checklist for Angular applications. Use when user asks to 'prepare for deploy', 'review before publishing', 'clean up code for production', or 'remove console.logs'. Applies rules: remove all console.log statements, remove unused functions and imports, verify navigation flows, update favicon, test critical user flows end-to-end. Make sure to use this skill whenever preparing any Angular app for deployment. Not for CI/CD configuration, build optimization, or hosting setup."
---

# Revisao Pre-Deploy Angular

> Antes de publicar, limpe todo codigo de debug, remova imports nao utilizados, e valide cada fluxo de usuario manualmente.

## Prerequisites

- Aplicacao Angular funcional em modo de desenvolvimento
- Acesso ao terminal com `ng serve` rodando

## Steps

### Step 1: Verificar navegacao completa

Navegar por todas as rotas da aplicacao e confirmar que:
- Todas as paginas carregam sem erros no console
- Links e botoes de navegacao funcionam corretamente
- Fluxos criticos (criar, listar, download) completam com sucesso

### Step 2: Remover todos os console.log

Buscar no projeto inteiro por `console.log` e remover cada ocorrencia:

```typescript
// REMOVER qualquer console.log de debug
console.log('teste', variavel) // ← apagar linha inteira
```

Use a busca global do editor (Ctrl+Shift+F) com o termo `console.log`.

### Step 3: Remover funcoes e variaveis nao utilizadas

```typescript
// ANTES — funcao de demonstracao que sobrou
export class CertificadoComponent implements OnInit {
  message = 'teste';

  ngOnInit() {
    console.log(this.message);
  }
}

// DEPOIS — componente limpo
export class CertificadoComponent {
  // apenas codigo em uso
}
```

Remover tambem:
- `implements OnInit` se `ngOnInit` foi removido
- Import de `OnInit` do `@angular/core` se nao usado
- Componentes importados mas nao referenciados no template

### Step 4: Atualizar favicon

No `index.html`, trocar o favicon padrao do Angular pela logo do projeto:

```html
<!-- ANTES -->
<link rel="icon" type="image/x-icon" href="favicon.ico">

<!-- DEPOIS -->
<link rel="icon" type="image/svg+xml" href="nave/logo.svg">
```

### Step 5: Teste final end-to-end

Executar o fluxo completo uma ultima vez:
1. Criar um novo registro (ex: certificado)
2. Confirmar que aparece na listagem
3. Fazer download e verificar o arquivo
4. Navegar entre todas as paginas

## Output format

Codigo sem nenhum `console.log`, sem imports/funcoes orfas, favicon atualizado, e todos os fluxos validados manualmente.

## Error handling

- Se `console.log` esta dentro de um service de logging real → manter, nao e debug
- Se remover `OnInit` causa erro → verificar se outro lifecycle hook depende dele
- Se favicon nao aparece → limpar cache do navegador (Ctrl+Shift+R)

## Verification

```bash
# Confirmar zero console.logs no projeto
grep -r "console.log" src/ --include="*.ts"
# Resultado esperado: nenhuma ocorrencia

# Confirmar build sem erros
ng build
```

## Heuristics

| Situacao | Acao |
|----------|------|
| `console.log` em interceptor HTTP de producao | Substituir por logging service, nao apenas apagar |
| Componente importado mas nao usado no template | Remover import e declaracao |
| `implements OnInit` sem `ngOnInit` no corpo | Remover interface e import |
| Favicon padrao do Angular (logo angular) | Trocar pela logo do projeto |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deploy com `console.log` de debug | Busca global e remocao antes do build |
| Deixar favicon padrao do Angular | Atualizar para a identidade visual do projeto |
| Manter imports nao utilizados | Remover e confirmar que compila |
| Pular teste manual antes de publicar | Testar cada fluxo critico pelo menos 1x |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
