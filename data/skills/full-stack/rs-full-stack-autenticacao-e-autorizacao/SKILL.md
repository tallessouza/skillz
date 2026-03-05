---
name: rs-full-stack-autenticacao-e-autorizacao
description: "Enforces correct authentication and authorization patterns when building backend systems. Use when user asks to 'add login', 'protect routes', 'add auth', 'create middleware', 'check permissions', or 'add roles'. Distinguishes authentication (identity verification via credentials/tokens) from authorization (permission checking via roles/rules). Make sure to use this skill whenever implementing any auth-related feature. Not for OAuth provider setup, session storage strategies, or cryptographic algorithm selection."
---

# Autenticacao e Autorizacao

> Autenticacao verifica QUEM e o usuario; autorizacao verifica O QUE ele pode fazer.

## Key concept

Autenticacao e autorizacao sao dois processos distintos que trabalham em sequencia. Primeiro o usuario prova sua identidade (autenticacao), depois o sistema verifica se ele tem permissao para a acao solicitada (autorizacao). Confundir os dois leva a falhas de seguranca e arquitetura fragil.

**Analogia do instrutor:** Autenticacao e como mostrar seu documento na portaria — prova quem voce e. Autorizacao e como o cracha que define quais setores voce pode acessar — nem todo funcionario entra no cofre do banco.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Usuario enviando email+senha | Fluxo de autenticacao: validar credenciais, retornar token |
| Requisicao com token no header | Fluxo de autorizacao: extrair usuario do token, verificar permissoes |
| Rota que qualquer logado acessa | Apenas middleware de autenticacao (verificar token valido) |
| Rota restrita a perfil especifico | Middleware de autenticacao + middleware de autorizacao (verificar role/permission) |
| Erro de credenciais invalidas | Status 401 — problema de autenticacao |
| Erro de permissao insuficiente | Status 403 — problema de autorizacao (401 tambem aceito por convencao) |

## How to think about it

### Fluxo de autenticacao

```
Cliente envia email + senha
  → Backend verifica: usuario existe no banco?
    → NAO: retorna "email ou senha invalido"
    → SIM: senha confere?
      → NAO: retorna "email ou senha invalido"
      → SIM: retorna token de autenticacao (o "cracha")
```

O token e como um cracha: a partir desse momento, o usuario apresenta o token em cada requisicao para provar quem e, sem precisar enviar email+senha novamente.

### Fluxo de autorizacao

```
Cliente envia requisicao com token
  → Middleware extrai usuario do token
  → Sistema verifica: esse usuario tem permissao para esta acao?
    → SIM: segue o fluxo (ex: cadastrar produto)
    → NAO: retorna 401/403 "nao autorizado"
```

### Exemplo pratico: marketplace

| Papel | Pode visualizar produtos | Pode comprar | Pode cadastrar produto |
|-------|-------------------------|-------------|----------------------|
| Cliente | Sim | Sim | Nao |
| Vendedor | Sim | Sim | Sim |
| Admin | Sim | Sim | Sim |

Todos sao **autenticados**, mas cada papel tem **autorizacoes** diferentes.

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| Auth e uma coisa so | Sao dois processos distintos executados em sequencia |
| Usuario autenticado pode fazer tudo | Autenticacao nao implica autorizacao — roles definem o acesso |
| 401 e so para login errado | 401 tambem serve para acesso nao autorizado a recursos protegidos |
| Basta verificar o token existe | Precisa verificar se o token e valido E se o usuario tem a permissao necessaria |

## When to apply

- Toda rota que precisa saber quem esta chamando → autenticacao
- Toda rota que restringe acesso por perfil/role → autorizacao
- Ao desenhar middlewares: separe middleware de autenticacao (extrai usuario) do middleware de autorizacao (verifica permissao), porque sao responsabilidades diferentes
- Ao retornar erros: escolha o status code correto baseado em QUAL processo falhou

## Limitations

- Este modelo cobre autenticacao por credenciais (email+senha) com token. Flows como OAuth, SSO, magic links tem etapas adicionais
- Nao cobre estrategias de armazenamento de token (cookie vs localStorage vs httpOnly)
- Nao cobre algoritmos de hash de senha ou assinatura de JWT

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de codigo expandidos com variacoes