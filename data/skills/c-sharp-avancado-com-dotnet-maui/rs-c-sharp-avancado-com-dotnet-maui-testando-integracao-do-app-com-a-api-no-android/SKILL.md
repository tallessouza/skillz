---
name: rs-csharp-maui-testando-integracao-android
description: "Guides multi-project debugging setup in Visual Studio and Rider for .NET MAUI apps with APIs. Use when user asks to 'debug app and API together', 'run multiple projects simultaneously', 'test MAUI app with API', 'configure startup projects', or 'debug integration between app and backend'. Make sure to use this skill whenever setting up simultaneous execution of .NET MAUI app and API projects in the same solution. Not for single-project debugging, unit testing, or CI/CD pipeline configuration."
---

# Testando Integracao do App com a API no Android

> Configure a solution para executar e debugar simultaneamente o app .NET MAUI e a API, sem precisar de multiplas instancias da IDE.

## Prerequisites

- App e API dentro da mesma Solution
- DevTunnel configurado (URL publica para a API, porque o dispositivo Android nao acessa localhost)
- Dispositivo Android conectado e reconhecido pela IDE
- Banco de dados configurado (MySQL ou SQL Server)

## Metodo 1: Multiple Startup Projects (Visual Studio)

### Step 1: Configurar a Solution

1. Botao direito na **Solution** → **Properties**
2. Selecionar **Multiple Startup Projects** (em vez de Single Startup Project)
3. Para `PlanShare.Api` → selecionar **Start** (com debug) ou **Start Without Debugging** (sem breakpoints, mais rapido)
4. Para `PlanShare.App` → selecionar **Start**
5. Clicar **OK**

### Step 2: Verificar configuracoes antes de executar

- Clicar na seta ao lado do botao Start → **DevTunnels** → garantir que o tunnel esta marcado (porque a API precisa da URL publica, nao localhost)
- Verificar **Android Local Devices** → garantir que o dispositivo esta selecionado

### Step 3: Executar

Pressionar **F5** — ambos os projetos fazem build e executam simultaneamente. Breakpoints funcionam em ambos os projetos (F10 para step over, F11 para step into).

## Metodo 2: Start New Instance (Visual Studio)

> Preferivel quando voce nao precisa da API o tempo todo.

1. Executar o app normalmente (F5 com Single Startup Project)
2. Quando precisar da API: botao direito no projeto da API → **Debug** → **Start New Instance**
3. O Swagger abre com DevTunnel ativado, pronto para receber requests do app

### Quando usar cada metodo

| Situacao | Metodo |
|----------|--------|
| Precisa sempre dos dois projetos juntos | Multiple Startup Projects |
| Foco principal no app, API sob demanda | Start New Instance |
| Quer performance maxima na API (sem breakpoints) | Start Without Debugging |

## Verificacao

1. Realizar uma acao no app que chame a API (ex: registrar conta)
2. Confirmar que breakpoints sao atingidos em ambos os projetos
3. Verificar no banco de dados que os dados foram persistidos

```sql
-- Verificar dados inseridos
SELECT * FROM users;
```

## Error Handling

- Se breakpoints nao funcionam na API → verificar se esta com **Start** (nao Start Without Debugging)
- Se o app nao conecta na API → verificar se o DevTunnel esta ativo e selecionado
- Se o dispositivo nao aparece → verificar conexao USB e que o dispositivo esta listado em Android Local Devices
- Delay na inicializacao da API e normal — o processo de configuracao e mais lento que o app

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
