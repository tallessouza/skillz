---
name: rs-full-stack-tipos-de-testes
description: "Enforces correct test type selection when writing automated tests for applications. Use when user asks to 'write tests', 'add test coverage', 'test this function', 'test this feature', 'create e2e tests', or any testing task. Applies framework: unit tests for isolated functions, integration tests for combined units, end-to-end tests for user flow simulation. Make sure to use this skill whenever deciding what kind of test to write or structuring a test suite. Not for test runner configuration, CI/CD pipeline setup, or performance/load testing."
---

# Tipos de Testes Automatizados

> Escolha o tipo de teste pela granularidade do comportamento sendo verificado: unidade isolada, unidades integradas, ou fluxo completo do usuario.

## Rules

1. **Teste unitario para responsabilidade unica** — teste uma funcao que faz UMA coisa (`validateEmail`, `checkUserExists`, `isProductRegistered`), porque isolamento garante que falhas apontam exatamente onde o problema esta
2. **Teste de integracao para unidades trabalhando juntas** — teste fluxos que combinam multiplas etapas (login = verificar existencia + validar credenciais), porque bugs de integracao nao aparecem em testes unitarios
3. **Teste end-to-end para simular o usuario final** — simule o uso real da aplicacao (enviar requisicao de autenticacao e verificar resposta), porque garante que o sistema inteiro funciona do ponto de vista de quem usa
4. **Defina criterios claros de aprovacao** — cada teste deve ter condicoes explicitas de sucesso/falha, porque testes sem criterios claros dao falsa confianca
5. **Prefira automacao a teste manual** — automatize testes repetitivos para garantir execucao consistente, porque testes manuais nao escalam e sao propensos a erro humano

## Decision framework

| Situacao | Tipo de teste | Exemplo |
|----------|---------------|---------|
| Funcao pura com uma responsabilidade | Unitario | `validateEmail(email)` retorna true/false |
| Funcao que verifica existencia no banco | Unitario (com mock) ou Integracao | `checkUserExists(email)` |
| Fluxo de login completo | Integracao | Verificar usuario + validar senha + gerar token |
| Processo de autenticacao como usuario faria | End-to-end | Enviar POST /login com credenciais, verificar resposta |
| Cadastro de produto com validacoes | Integracao | Validar dados + verificar duplicata + salvar |
| Navegacao e interacao na UI | End-to-end | Preencher formulario, clicar botao, verificar redirecionamento |

## Example

**Sem estrategia de teste (tudo manual):**
```
Desenvolvedor testa manualmente cada funcionalidade
→ Esquece de testar edge cases
→ Bug vai para producao
→ Retrabalho
```

**Com estrategia de teste automatizado:**
```typescript
// Teste unitario — uma funcao, uma responsabilidade
test('validateEmail rejects invalid email', () => {
  expect(validateEmail('invalid')).toBe(false)
  expect(validateEmail('user@example.com')).toBe(true)
})

// Teste de integracao — unidades trabalhando juntas
test('login flow validates user and returns token', async () => {
  const user = await createUser({ email: 'user@test.com', password: '123456' })
  const result = await loginUser({ email: 'user@test.com', password: '123456' })

  expect(result.user.id).toBe(user.id)
  expect(result.token).toBeDefined()
})

// Teste end-to-end — simula o usuario final
test('user can authenticate via API', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'user@test.com', password: '123456' })

  expect(response.status).toBe(200)
  expect(response.body.user).toBeDefined()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao pura sem dependencias externas | Teste unitario direto |
| Funcao que depende de banco/API | Teste de integracao ou unitario com mock |
| Fluxo com multiplas etapas sequenciais | Teste de integracao |
| Validar experiencia completa do usuario | Teste end-to-end |
| Bug reportado em producao | Escreva teste que reproduz o bug antes de corrigir |
| Funcionalidade critica (auth, pagamento) | Todos os 3 niveis de teste |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Testar apenas manualmente | Automatize com framework de testes |
| Escrever teste e2e para logica pura | Use teste unitario para funcoes isoladas |
| Teste unitario para fluxo multi-etapa | Use teste de integracao |
| Teste sem criterio de aprovacao claro | Defina expects explicitos para cada cenario |
| Pular testes porque "funciona na minha maquina" | Automatize para garantir consistencia em qualquer ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que testar, analogias e quando usar cada tipo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes