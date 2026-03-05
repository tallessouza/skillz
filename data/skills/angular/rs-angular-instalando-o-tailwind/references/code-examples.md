# Code Examples: Instalando Tailwind CSS no Angular

## Comando de instalacao completo

```bash
npm install tailwindcss@4.1.4 @tailwindcss/postcss@4.1.4 postcss@8.5.3 --force
```

Tres bibliotecas instaladas:
- `tailwindcss@4.1.4` — o framework CSS principal
- `@tailwindcss/postcss@4.1.4` — plugin PostCSS do Tailwind
- `postcss@8.5.3` — processador CSS necessario

A flag `--force` evita conflitos de peer dependencies com o Angular.

## Arquivo .postcssrc.json

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Localizacao: raiz do projeto (mesmo diretorio do `package.json`).

## Import no styles.css

```css
@import "tailwindcss";
```

Arquivo: `src/styles.css` — a folha de estilo base do projeto Angular.

## Template de teste

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

Aplicado em `src/app/app.component.html`, substituindo todo o template padrao do Angular.

### O que cada classe faz

| Classe | Propriedade CSS |
|--------|----------------|
| `text-3xl` | `font-size` e `line-height` com variaveis do Tailwind |
| `font-bold` | `font-weight: bold` |
| `underline` | `text-decoration-line: underline` |

## Exemplo de uso do autocomplete

```html
<!-- Digitar bg- no VS Code com IntelliSense ativo mostra: -->
<h1 class="text-3xl font-bold underline bg-blue-500">Hello world!</h1>
```

`bg-blue-500` aplica `background-color` com a cor azul do sistema de design do Tailwind.

## Verificacao no package.json

Apos instalacao, confirme em `package.json`:

```json
{
  "dependencies": {
    "tailwindcss": "4.1.4",
    "@tailwindcss/postcss": "4.1.4",
    "postcss": "8.5.3"
  }
}
```

## Comparacao: com vs sem Tailwind

### Sem Tailwind (CSS tradicional)

```css
/* styles.css ou component.css */
.titulo-principal {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: bold;
  text-decoration-line: underline;
}
```

```html
<h1 class="titulo-principal">Hello world!</h1>
```

Problemas: precisa inventar nome de classe, manter arquivo CSS separado, risco de duplicacao.

### Com Tailwind

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

Sem arquivo CSS adicional, sem decisao de naming, padronizado.