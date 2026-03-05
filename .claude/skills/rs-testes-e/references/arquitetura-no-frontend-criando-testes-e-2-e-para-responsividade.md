---
name: rs-testes-arq-frontend-e2e-responsividade
description: "Enforces Playwright responsive testing patterns when writing E2E tests for different viewport sizes. Use when user asks to 'test responsive', 'test mobile', 'test viewport', 'write e2e test for different screen sizes', or 'test sidebar on mobile'. Applies setViewportSize per-test instead of per-file, validates visibility state changes, and configures multi-browser testing. Make sure to use this skill whenever creating Playwright tests that involve responsive behavior or viewport-dependent UI. Not for unit tests, visual regression tests, or CSS media query writing."
---

# Testes E2E para Responsividade com Playwright

> Teste responsividade setando viewport por teste individual, nunca por arquivo separado — controle granular sem duplicacao de arquivos.

## Rules

1. **Use `page.setViewportSize()` dentro do teste** — nao crie arquivos separados para mobile e desktop, porque o controle granular por teste evita duplicacao e permite testar responsividade dentro de fluxos existentes
2. **Valide estados de visibilidade com assertivas especificas** — use `toBeVisible()`, `toBeInViewport()`, `toBeHidden()` conforme o contexto, porque cada um tem semantica diferente
3. **Verifique atributos ARIA apos interacoes** — `toHaveAttribute('aria-expanded', 'false')` antes do clique, `'true'` depois, porque garante acessibilidade alem da visibilidade
4. **Teste o ciclo completo abrir/fechar** — valide o estado inicial, apos abrir e apos fechar, porque estados intermediarios podem esconder bugs
5. **Configure multiplos browsers no Playwright config** — Chrome, Firefox e Safari, porque bugs aparecem em browsers especificos que testes manuais nao cobrem
6. **Use traces, screenshots e videos apenas on-failure** — porque reduz artefatos em testes que passam e facilita debug quando falham

## How to write

### Teste mobile com viewport customizada

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sidebar Responsiva', () => {
  test('Mobile: menu hamburger deve abrir e fechar a sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');

    const openButton = page.getByLabel('Abrir menu');

    // Estado inicial: sidebar fechada
    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');

    // Abre sidebar
    await openButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('complementary')).toBeVisible();
    await expect(page.getByLabel('Fechar menu')).toBeInViewport();
    await expect(page.getByPlaceholder('Buscar prompts')).toBeInViewport();

    // Fecha sidebar
    const closeButton = page.getByLabel('Fechar menu');
    await closeButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('complementary')).not.toBeInViewport();
    await expect(page.getByLabel('Fechar menu')).not.toBeInViewport();
    await expect(page.getByPlaceholder('Buscar prompts')).not.toBeInViewport();
  });
});
```

### Teste desktop no mesmo arquivo

```typescript
test('Desktop: menu hamburger deve estar oculto e conteudo visivel', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/');

  await expect(page.getByLabel('Abrir menu')).toBeHidden();
  await expect(page.getByPlaceholder('Buscar prompts')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Minimizar sidebar' })).toBeVisible();
  await expect(page.getByLabel('Fechar menu')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Selecione um prompt' })).toBeVisible();
});
```

## Example

**Before (arquivos separados, sem verificacao ARIA):**
```typescript
// sidebar-mobile.spec.ts
test('sidebar mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.click('#menu-btn');
  // sem verificacao de estado inicial ou atributos ARIA
});

// sidebar-desktop.spec.ts  ← arquivo desnecessario
test('sidebar desktop', async ({ page }) => {
  await page.goto('/');
});
```

**After (arquivo unico, ciclo completo, ARIA verificado):**
```typescript
// sidebar.responsive.spec.ts
test.describe('Sidebar Responsiva', () => {
  test('Mobile: abre e fecha sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const openButton = page.getByLabel('Abrir menu');
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await openButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('complementary')).toBeInViewport();
    // ... fecha e verifica estado final
  });

  test('Desktop: sidebar visivel por default', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');
    await expect(page.getByLabel('Abrir menu')).toBeHidden();
    await expect(page.getByRole('complementary')).toBeVisible();
  });
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando fluxo que tem comportamento mobile diferente | Adicione teste com `setViewportSize` no mesmo arquivo do fluxo |
| Arquivo dedicado a responsividade | Use `.responsive.spec.ts` como sufixo |
| Viewport mobile | `{ width: 375, height: 800 }` como referencia |
| Viewport desktop | `{ width: 1024, height: 800 }` como referencia |
| Elemento aparece/desaparece com viewport | Use `toBeInViewport()` / `not.toBeInViewport()` |
| Elemento nunca renderiza naquela viewport | Use `toBeHidden()` |
| Botao toggle (abrir/fechar) | Verifique `aria-expanded` antes e depois do clique |
| Teste falha em browser especifico | Analise trace/video/screenshot gerados on-failure |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar arquivo separado so para testar mobile | `setViewportSize` dentro do teste no mesmo arquivo |
| Testar so no Chrome | Configure Chrome, Firefox e Safari no `playwright.config.ts` |
| Ignorar estado inicial antes de interagir | Sempre valide o estado fechado/oculto antes de clicar |
| Usar so `toBeVisible` para tudo | Use `toBeInViewport` quando o elemento pode existir fora da viewport |
| Guardar screenshots/videos de testes que passam | Configure `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-testes-e-2-e-para-responsividade/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-testes-e-2-e-para-responsividade/references/code-examples.md)
