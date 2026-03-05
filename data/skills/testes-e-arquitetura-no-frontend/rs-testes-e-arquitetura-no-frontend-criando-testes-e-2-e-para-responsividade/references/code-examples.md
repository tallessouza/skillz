# Code Examples: Testes E2E para Responsividade

## Exemplo completo do teste de sidebar responsiva

```typescript
// sidebar.responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Sidebar Responsiva', () => {
  test('Mobile: menu hamburger deve abrir e fechar a sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');

    // Estado inicial — sidebar fechada
    const openButton = page.getByLabel('Abrir menu');
    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');

    // Abre a sidebar
    await openButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('complementary')).toBeVisible();

    const closeButton = page.getByLabel('Fechar menu');
    await expect(closeButton).toBeInViewport();
    await expect(page.getByPlaceholder('Buscar prompts')).toBeInViewport();

    // Fecha a sidebar
    await closeButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('complementary')).not.toBeInViewport();
    await expect(page.getByLabel('Fechar menu')).not.toBeInViewport();
    await expect(page.getByPlaceholder('Buscar prompts')).not.toBeInViewport();
  });

  test('Desktop: menu hamburger deve estar oculto e conteudo visivel', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    await expect(page.getByLabel('Abrir menu')).toBeHidden();
    await expect(page.getByPlaceholder('Buscar prompts')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Minimizar sidebar' })).toBeVisible();
    await expect(page.getByLabel('Fechar menu')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Selecione um prompt' })).toBeVisible();
  });
});
```

## Configuracao do Playwright com multiplos browsers e devices

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Desktop browsers
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile devices (opcional)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],
});
```

## Variacao: testando responsividade dentro de um fluxo existente

```typescript
// login.spec.ts — arquivo de fluxo existente
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    // ... teste normal desktop
  });

  test('Mobile: deve fazer login com sidebar colapsada', async ({ page }) => {
    // Seta viewport mobile DENTRO do teste existente
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/login');

    // Mesmo fluxo, mas verificando comportamento mobile
    await page.getByPlaceholder('Email').fill('user@test.com');
    await page.getByPlaceholder('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Apos login, sidebar deve estar fechada no mobile
    await expect(page.getByRole('complementary')).not.toBeInViewport();
    await expect(page.getByLabel('Abrir menu')).toBeVisible();
  });
});
```

## Assertivas de visibilidade — quando usar cada uma

```typescript
// toBeVisible — elemento existe e esta visivel no DOM
await expect(page.getByRole('button')).toBeVisible();

// toBeHidden — elemento nao esta visivel (display:none, não existe, etc.)
await expect(page.getByLabel('Abrir menu')).toBeHidden();

// toBeInViewport — elemento visivel E dentro da area visivel da tela
await expect(page.getByRole('complementary')).toBeInViewport();

// not.toBeInViewport — existe mas esta fora da tela (sidebar animada)
await expect(page.getByRole('complementary')).not.toBeInViewport();

// toHaveAttribute — verifica atributos ARIA
await expect(button).toHaveAttribute('aria-expanded', 'false');
await expect(button).toHaveAttribute('aria-expanded', 'true');
```