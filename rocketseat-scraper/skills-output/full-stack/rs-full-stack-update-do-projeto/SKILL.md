---
name: rs-full-stack-update-do-projeto
description: "Enforces best practices for updating deployed frontend projects by testing changes locally before pushing to production. Use when user asks to 'update the app', 'change button styles', 'modify UI before deploy', 'test changes locally', or 'prepare an update for production'. Guides the local-first development cycle: modify, verify locally, then deploy. Make sure to use this skill whenever making UI changes to a deployed project. Not for initial project setup, backend API changes, or CI/CD pipeline configuration."
---

# Update do Projeto — Ciclo de Atualização Frontend

> Toda modificação em projeto deployado deve ser verificada localmente antes de ir para produção.

## Rules

1. **Rode o projeto localmente antes de modificar** — execute `npm run dev` ou equivalente e confirme que o app funciona no localhost, porque modificar sem ver o estado atual causa regressões invisíveis
2. **Modifique uma coisa por vez** — altere um componente, verifique visualmente, depois passe ao próximo, porque mudanças em lote dificultam identificar qual alteração quebrou algo
3. **Reutilize cores já existentes no projeto** — copie valores de cor de elementos que já funcionam visualmente, porque manter consistência visual evita design fragmentado
4. **Teste visualmente no browser antes de commitar** — confirme que a mudança renderiza como esperado no localhost, porque deploy sem verificação visual é deploy às cegas
5. **Mantenha o texto legível sobre o background** — ao mudar background-color, ajuste a cor do texto para manter contraste, porque botão bonito mas ilegível é pior que o original

## Steps

### Step 1: Rodar o projeto localmente
```bash
npm run dev
# Acesse http://localhost:5173 (Vite) ou a porta configurada
```

### Step 2: Identificar o componente a modificar
```typescript
// Localize o componente no código
// Ex: app.tsx → Button component → button.module.css
```

### Step 3: Aplicar a modificação de estilo
```css
/* button.module.css */
.button {
  background-color: #NewColor; /* Use cor já existente no projeto */
  border: 1px solid #NewColor;
  color: #000000; /* Ajuste contraste do texto */
}
```

### Step 4: Verificar no browser
- Confira visualmente que o componente renderiza corretamente
- Verifique contraste texto/fundo
- Teste interações (hover, click, focus)

### Step 5: Commitar e preparar para deploy
```bash
git add .
git commit -m "feat: update button styling"
```

## Example

**Before (botão com cor padrão):**
```css
.button {
  background-color: #6c63ff;
  border: 1px solid #6c63ff;
  color: #ffffff;
}
```

**After (botão atualizado com cor do projeto):**
```css
.button {
  background-color: #e8d44d;
  border: 1px solid #e8d44d;
  color: #000000;
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Mudando cor de fundo de elemento | Verificar se a cor do texto mantém contraste |
| Precisando de uma cor nova | Primeiro procurar cores já usadas no projeto |
| Múltiplas mudanças visuais | Fazer uma por vez, verificar cada no browser |
| Projeto já deployado | Sempre testar localmente antes de enviar |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Mudar CSS e dar push direto | Mudar CSS → verificar localhost → push |
| Inventar cor nova sem referência | Reutilizar cor existente do projeto |
| Mudar background sem ajustar texto | Sempre verificar contraste texto/fundo |
| Modificar vários componentes de uma vez | Uma mudança por vez, verificar cada uma |

## Verification

- Abra o localhost e confirme visualmente que a mudança está correta
- Verifique que nenhum texto ficou ilegível
- Confirme que o projeto builda sem erros: `npm run build`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ciclo de atualização e boas práticas visuais
- [code-examples.md](references/code-examples.md) — Exemplos de código com variações de estilização