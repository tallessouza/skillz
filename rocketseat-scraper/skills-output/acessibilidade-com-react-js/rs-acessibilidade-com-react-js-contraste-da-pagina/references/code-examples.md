# Code Examples: Contraste de Cores

## Exemplo 1: Correcao global no CSS

### Antes — sem cor definida globalmente

```css
/* global.css — nenhuma declaracao de color */
body {
  background: #121214;
}
```

```css
/* home.module.css — cor definida por modulo, baixo contraste */
.container p {
  color: #555; /* contraste ~2.5:1 contra #121214 — FALHA */
}
```

### Depois — cor global com contraste validado

```css
/* global.css */
body {
  color: #a8a8b3; /* contraste 7.94:1 contra #121214 — PASSA AAA */
  background: #121214;
}
```

```css
/* home.module.css — color removido, herda do body */
.container p {
  /* color removido */
}
```

**Resultado:** Todos os textos da pagina passam automaticamente. Contraste 7.94:1 atinge ate nivel AAA.

---

## Exemplo 2: Correcao especifica no footer

### Problema

O footer tem um link (`<a>`) sobre fundo escuro. Mesmo com a cor global, o link nao atinge contraste suficiente por ter cor propria.

### Tentativa 1 — adicionar background (insuficiente)

```css
.footer a {
  /* cor original do link — roxo escuro da Rocketseat */
  padding: 1rem 2rem;
  background: #202024;
  border-radius: 5px;
}
/* Resultado: contraste 3.43:1 — FALHA */
```

### Solucao — clarear a cor do texto

```css
.footer a {
  color: #996dff; /* roxo mais claro */
  padding: 1rem 2rem;
  background: #202024;
  border-radius: 5px;
}
/* Resultado: contraste 4.62:1 — PASSA nivel AA */
```

---

## Exemplo 3: Estilizacao do footer copiando padrao do header

O instrutor mostrou que reutilizou a estilizacao do header para o footer, adicionando `className={styles.footer}`:

```tsx
// Footer component
<footer>
  <a className={styles.footer} href="/terms">
    Termos de uso
  </a>
</footer>
```

```css
/* Copiou estilizacao do header e adaptou */
.footer a {
  color: #996dff;
  background: #202024;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
}
```

---

## Tabela de referencia: cores usadas na aula

| Cor | Hex | Uso | Contraste vs #121214 |
|-----|-----|-----|---------------------|
| Cinza medio | `#555` | Texto (ANTES) | ~2.5:1 — FALHA |
| Cinza claro | `#a8a8b3` | Texto global (DEPOIS) | 7.94:1 — PASSA AAA |
| Roxo Rocketseat | (cor original) | Link footer | Insuficiente |
| Roxo claro | `#996dff` | Link footer (DEPOIS) | 4.62:1 vs #202024 — PASSA AA |
| Fundo card | `#202024` | Background de elementos | — |
| Fundo pagina | `#121214` | Background body | — |

---

## Verificacao no DevTools — passo a passo

```
1. F12 → Inspecionar elemento de texto
2. No painel Styles, clicar no quadrado colorido da propriedade `color`
3. Expandir "Contrast ratio" no color picker
4. Verificar:
   - ✅ >= 4.5 para texto normal (AA)
   - ✅ >= 3.0 para texto grande (AA)
   - ✅ >= 7.0 para texto normal (AAA)
5. Arrastar seletor para testar cores alternativas em tempo real
```