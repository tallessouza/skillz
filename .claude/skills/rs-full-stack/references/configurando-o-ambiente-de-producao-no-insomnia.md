---
name: rs-full-stack-config-prod-insomnia
description: "Applies Insomnia environment variable configuration for switching between development and production API URLs. Use when user asks to 'configure Insomnia', 'set up API environments', 'switch between dev and prod', 'test production API', or 'import Insomnia collection'. Ensures base URL variables are used across all requests so environment switching is instant. Make sure to use this skill whenever setting up API testing tools with multiple environments. Not for CI/CD pipelines, automated testing, or Postman configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [insomnia, api-testing, environments, http-client]
---

# Configurando Ambientes de Produção no Insomnia

> Use variáveis de ambiente no Insomnia para alternar entre dev e produção sem alterar requisições individuais.

## Prerequisites

- Insomnia ou Insomnium instalado
- API rodando em desenvolvimento (localhost)
- API deployada em produção (ex: Render)
- Coleção de requisições existente (ou arquivo JSON para importar)

## Steps

### Step 1: Importar coleção de requisições (se necessário)

Se não possui as requisições configuradas:

1. Abrir Insomnia
2. Clicar em **Create** → **Import**
3. Arrastar o arquivo JSON ou clicar em **Choose a File**
4. Selecionar o arquivo de coleção (ex: `insomnia-routes.json`)

### Step 2: Criar variável de ambiente DEV

1. Clicar na engrenagem de environments
2. Criar ambiente chamado **Dev**
3. Selecionar cor verde para identificação visual
4. Definir variável `base_url`:

```json
{
  "base_url": "http://localhost:3333"
}
```

### Step 3: Criar variável de ambiente PROD

1. Clicar no botão **+** para adicionar novo **Sub Environment**
2. Renomear para **Prod**
3. Selecionar cor vermelha para identificação visual
4. Definir a mesma variável `base_url` com a URL de produção:

```json
{
  "base_url": "https://your-app.onrender.com"
}
```

A porta não precisa ser especificada na URL de produção — já está configurada internamente no serviço de deploy.

### Step 4: Usar a variável em todas as requisições

Em cada requisição, referenciar a variável no lugar da URL fixa:

```
{{ base_url }}/deliveries
{{ base_url }}/users
{{ base_url }}/sessions
```

### Step 5: Alternar entre ambientes

- Selecionar **Dev** → todas as requisições apontam para `localhost:3333`
- Selecionar **Prod** → todas as requisições apontam para a URL de produção

## Output format

Dois ambientes configurados no Insomnia:

| Ambiente | Cor | base_url |
|----------|-----|----------|
| Dev | Verde | `http://localhost:3333` |
| Prod | Vermelho | `https://your-app.onrender.com` |

Todas as requisições usam `{{ base_url }}` como prefixo.

## Heuristics

| Situação | Faça |
|----------|------|
| Adicionando nova requisição | Sempre usar `{{ base_url }}` como prefixo, nunca URL hardcoded |
| Testando deploy novo | Mude apenas a variável no ambiente Prod, todas as rotas atualizam |
| Múltiplos ambientes (staging, QA) | Crie Sub Environments adicionais com cores distintas |
| URL de produção mudou | Altere apenas no ambiente Prod — reflete em todas as requisições |
| Quer verificar se API está online | Acesse a URL base no navegador — espere "Cannot GET /" como sinal de funcionamento |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Hardcode URL em cada requisição | Use variável de ambiente `{{ base_url }}` |
| Editar URLs uma por uma ao trocar ambiente | Troque o ambiente selecionado no dropdown |
| Usar mesma cor para Dev e Prod | Use verde para Dev, vermelho para Prod |
| Incluir porta na URL de produção | Omita a porta — o serviço de deploy gerencia internamente |
| Nomear variável diferente entre ambientes | Use exatamente o mesmo nome (`base_url`) em todos |

## Verification

- Selecione Prod → clique em qualquer requisição → verifique URL Preview mostra a URL de produção
- Selecione Dev → verifique URL Preview mostra `localhost`
- Envie uma requisição em Prod → deve receber resposta do servidor de produção


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Requisicao falha em producao mas funciona em dev | URL de producao incorreta ou API offline | Acesse a URL base no navegador — espere 'Cannot GET /' como sinal de funcionamento |
| Variavel base_url nao substitui na requisicao | Ambiente nao selecionado no dropdown | Selecione o ambiente correto (Dev ou Prod) no dropdown de environments |
| URL de producao com porta nao funciona | Porta inclusa na URL de producao | Omita a porta na URL de producao — o servico gerencia internamente |
| Requisicoes apontam para URL errada | base_url com nome diferente entre ambientes | Use exatamente o mesmo nome de variavel em todos os ambientes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre variáveis de ambiente e workflow de teste
- [code-examples.md](references/code-examples.md) — Exemplos de configuração JSON e variações de ambientes