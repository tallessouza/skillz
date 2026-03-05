---
name: rs-csharp-maui-ngrok-dev-tunnel
description: "Guides ngrok tunnel setup for exposing local APIs to mobile devices or external networks. Use when user asks to 'expose local API', 'create dev tunnel', 'connect mobile app to local server', 'use ngrok', or 'access localhost from phone'. Make sure to use this skill whenever a user needs to test a mobile app against a local API without Visual Studio DevTunnel. Not for production deployments, CI/CD pipelines, or reverse proxy configuration."
---

# Dev Tunnel com Ngrok

> Configure o ngrok para expor uma API local via URL publica, permitindo que dispositivos moveis acessem o servidor de desenvolvimento.

## Prerequisites

- Conta gratuita no [ngrok](https://ngrok.com/) criada
- Token de autenticacao obtido no [dashboard](https://dashboard.ngrok.com/get-started/setup)
- Executavel do ngrok baixado e extraido
- API local rodando e ouvindo em uma porta conhecida

## Steps

### Step 1: Baixar e configurar o ngrok

```bash
# Windows: baixar o zip, extrair o executavel
# Configurar o token de autenticacao
./ngrok.exe config add-authtoken SEU_TOKEN_AQUI
```

Isso cria um arquivo YML com as configuracoes e vincula o executavel a sua conta.

### Step 2: Identificar a porta da API local

Verificar em qual porta a API esta rodando. Exemplo: se o Swagger mostra `localhost:7045`, essa e a porta.

### Step 3: Criar o tunnel

```bash
# Substituir a URL pela URL real da sua API local
./ngrok.exe http https://localhost:7045
```

O ngrok gera uma URL publica (ex: `https://8bd2-74-xxx.ngrok-free.app`) que redireciona para a API local.

### Step 4: Usar a URL publica no aplicativo

A URL base do aplicativo mobile passa a ser a URL publica gerada pelo ngrok, em vez de `localhost`.

## Output format

O ngrok exibe no terminal:
- URL publica gerada (usar esta como base URL)
- Interface web em `http://localhost:4040` para monitorar requisicoes

## Error handling

- Se a URL parar de funcionar: a versao gratuita expira apos ~30 minutos. Gere novamente e atualize no app
- Se fechar o terminal: o tunnel para. Manter o terminal aberto durante o desenvolvimento
- Se a URL mudou: cada execucao gera uma URL diferente. Atualizar sempre no app
- Se 404 ao acessar: verificar se a API local ainda esta rodando na porta configurada

## Heuristics

| Situacao | Acao |
|----------|------|
| Usa Visual Studio | Preferir DevTunnel nativo, nao precisa de ngrok |
| Usa VS Code, Rider ou terminal | Usar ngrok |
| Precisa de URL estavel | Considerar plano pago do ngrok ou alternativas |
| Quer monitorar requests | Acessar `http://localhost:4040` |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Usar `localhost` no app mobile | Usar a URL publica do ngrok |
| Fechar o terminal do ngrok durante testes | Manter o terminal aberto |
| Hardcodar a URL do ngrok no codigo | Usar variavel de configuracao para a base URL |
| Usar ngrok free em producao | Usar apenas para desenvolvimento e testes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
