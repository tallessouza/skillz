---
name: rs-angular-assets-icons-setup
description: "Applies Angular asset management conventions when setting up icons, images, or static files in Angular projects. Use when user asks to 'add icons', 'setup assets', 'import images', 'configure static files', or 'organize public folder' in Angular. Ensures correct placement in public/ directory following Angular 17+ conventions. Make sure to use this skill whenever adding static assets to Angular projects. Not for React, Next.js, or non-Angular asset pipelines."
---

# Assets e Icones no Angular

> Arquivos estaticos (icones, imagens, fontes) vao na pasta `public/` na raiz do projeto, nunca em `src/assets/`.

## Rules

1. **Use `public/` na raiz, nao `src/assets/`** — a partir do Angular 17+, a pasta `public/` substituiu `src/assets/` como diretorio padrao de assets, porque o `angular.json` ja configura `public/` como asset root
2. **Organize em subpastas semanticas** — crie `public/images/`, `public/fonts/`, `public/icons/`, porque facilita manutencao e evita poluicao na raiz do public
3. **Use SVG para icones** — exporte sempre como SVG (nao PNG/JPG), porque SVGs escalam sem perda e sao editaveis via CSS
4. **Importe todos os assets de uma vez** — adicione todos os icones/imagens no inicio do projeto, porque pausar o desenvolvimento para importar assets quebra o fluxo de implementacao
5. **Referencie assets com path relativo a `public/`** — use `images/icon.svg` no template, nao `/public/images/icon.svg`, porque o Angular serve o conteudo de `public/` diretamente na raiz

## Steps

### Step 1: Verificar configuracao do angular.json

Confirme que a propriedade `assets` no `angular.json` inclui a pasta `public/`:

```json
{
  "assets": [
    {
      "glob": "**/*",
      "input": "public"
    }
  ]
}
```

### Step 2: Criar estrutura de pastas

```
public/
└── images/
    ├── logo.svg
    ├── icon-add.svg
    ├── icon-close.svg
    ├── icon-bell.svg
    └── ...
```

### Step 3: Referenciar no template do componente

```html
<img src="images/logo.svg" alt="GoTask Logo" />
```

## Output format

Apos aplicar o skill, o projeto deve ter:
- Pasta `public/images/` com todos os SVGs
- `angular.json` com `public` configurado como asset input
- Templates referenciando imagens com path relativo (sem `/public/`)

## Error handling

- Se `src/assets/` existir com arquivos: migre o conteudo para `public/` e remova `src/assets/`
- Se `angular.json` nao tiver a config de `public`: adicione manualmente a entrada no array `assets`
- Se imagens nao aparecerem: verifique se o servidor de dev foi reiniciado apos alterar `angular.json`

## Verification

- Abra `http://localhost:4200/images/logo.svg` no navegador — deve exibir o SVG diretamente
- Verifique no DevTools que as imagens carregam sem 404

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar icones em `src/assets/` (Angular 17+) | Colocar em `public/images/` |
| Importar icones um por um durante desenvolvimento | Importar todos de uma vez no inicio |
| Exportar icones como PNG do Figma | Exportar como SVG |
| Usar path absoluto `/public/images/x.svg` | Usar path relativo `images/x.svg` |
| Deixar SVGs soltos na raiz de `public/` | Organizar em subpasta `public/images/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
