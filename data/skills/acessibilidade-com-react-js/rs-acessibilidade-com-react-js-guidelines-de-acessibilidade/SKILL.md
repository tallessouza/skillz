---
name: rs-acessibilidade-react-guidelines
description: "Applies WCAG accessibility guidelines when building React web applications. Use when user asks to 'create a page', 'build a component', 'review accessibility', 'check a11y', or 'make accessible'. Enforces the 4 WCAG principles (Perceivable, Operable, Understandable, Robust) and criteria levels A/AA/AAA. Make sure to use this skill whenever generating HTML, JSX, or UI components, even if user doesn't mention accessibility. Not for backend logic, API design, or non-web interfaces."
---

# Guidelines de Acessibilidade (WCAG)

> Ao criar componentes web, aplique os 4 principios WCAG (Perceptivel, Operavel, Compreensivel, Robusto) verificando criterios de nivel A como minimo obrigatorio e AA como alvo recomendado.

## Rules

1. **Conteudo nao-textual precisa de alternativa em texto** — toda imagem significativa deve ter `alt` descritivo, porque leitores de tela anunciam o alt como unico meio de acesso ao conteudo visual (Criterio A)
2. **Imagens decorativas recebem alt vazio** — `alt=""` para ilustracoes, backgrounds e decoracoes visuais, porque descrever conteudo sem significado confunde usuarios de tecnologias assistivas
3. **Contraste de texto deve atender nivel AA** — ratio minimo 4.5:1 para texto normal, 3:1 para texto grande, porque usuarios com baixa visao nao conseguem ler texto com contraste insuficiente
4. **Todo conteudo deve ser operavel por teclado** — nenhuma funcionalidade pode depender exclusivamente do mouse, porque pessoas com deficiencia motora navegam via teclado ou voz
5. **Idioma da pagina deve ser declarado** — `<html lang="pt-BR">`, porque leitores de tela usam o atributo lang para pronunciar corretamente o conteudo
6. **Mensagens de status devem ser anunciadas** — use `role="status"` ou `role="alert"` para mensagens de sucesso/erro, porque usuarios de leitores de tela nao percebem mudancas visuais na tela

## Como aplicar

### Imagens significativas vs decorativas

```tsx
// Imagem com significado → alt descritivo
<img src="/grafico-vendas.png" alt="Grafico de vendas mostrando crescimento de 40% no Q3" />

// Imagem decorativa → alt vazio (ignorada pelo leitor de tela)
<img src="/circulo-decorativo.svg" alt="" />
```

### Mensagens de status acessiveis

```tsx
// Mensagem de erro anunciada automaticamente
<div role="alert">
  Erro ao enviar formulario. Verifique os campos obrigatorios.
</div>

// Mensagem de sucesso anunciada automaticamente
<div role="status">
  Cadastro realizado com sucesso!
</div>
```

### Navegacao por teclado

```tsx
// Interativo → deve ser focavel e ativavel por teclado
<button onClick={handleClick}>Enviar</button>

// NUNCA: div com onClick sem suporte a teclado
// <div onClick={handleClick}>Enviar</div>
```

## Example

**Before (inacessivel):**
```tsx
<html>
  <body>
    <img src="/logo.png" />
    <img src="/decoracao.svg" />
    <div onClick={() => setOpen(true)}>Abrir menu</div>
    <div style={{ color: '#aaa', background: '#fff' }}>Texto claro</div>
    {error && <span>Erro no formulario</span>}
  </body>
</html>
```

**After (com WCAG aplicado):**
```tsx
<html lang="pt-BR">
  <body>
    <img src="/logo.png" alt="Logo da empresa XYZ" />
    <img src="/decoracao.svg" alt="" />
    <button onClick={() => setOpen(true)}>Abrir menu</button>
    <div style={{ color: '#595959', background: '#fff' }}>Texto com contraste AA</div>
    {error && <div role="alert">Erro no formulario</div>}
  </body>
</html>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Imagem transmite informacao | `alt` descritivo do conteudo |
| Imagem e puramente decorativa | `alt=""` |
| Elemento interativo customizado | Use tag semantica (`button`, `a`) ou adicione `role` + `tabIndex` + `onKeyDown` |
| Texto sobre fundo colorido | Verifique ratio de contraste (4.5:1 minimo AA) |
| Mensagem de erro/sucesso aparece | Use `role="alert"` ou `role="status"` |
| Audio/video no site | Forneca legendas ou transcricao |
| Som de fundo automatico | Permita desabilitar ou mantenha 20dB abaixo da voz |
| Abreviacoes no conteudo | Use `<abbr title="significado">` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<img src="foto.jpg" />` sem alt | `<img src="foto.jpg" alt="Descricao do conteudo" />` |
| `<div onClick={fn}>Acao</div>` | `<button onClick={fn}>Acao</button>` |
| `<html>` sem lang | `<html lang="pt-BR">` |
| Contraste abaixo de 4.5:1 | Ajustar cores para atingir ratio AA |
| Mensagem de erro sem role | `<div role="alert">Mensagem</div>` |
| Descrever imagem decorativa | `alt=""` para ignorar no leitor de tela |

## Niveis de criterios WCAG

| Nivel | Criterios | Complexidade | Objetivo |
|-------|-----------|-------------|----------|
| **A** | 30 criterios | Basico, menor impacto no design | Minimo obrigatorio |
| **AA** | 20 criterios adicionais (requer A) | Media, altera design (ex: contraste) | Alvo recomendado, exigido por lei em alguns paises |
| **AAA** | 28 criterios adicionais (requer AA) | Alta, regras mais estritas | Ideal, nem sempre possivel em todos os sites |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
