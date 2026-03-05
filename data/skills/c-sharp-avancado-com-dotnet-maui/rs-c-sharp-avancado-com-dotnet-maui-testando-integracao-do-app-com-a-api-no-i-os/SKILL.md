---
name: rs-csharp-maui-multi-project-run
description: "Applies multi-project execution configuration in JetBrains Rider and Visual Studio for .NET MAUI apps with APIs. Use when user asks to 'run API and app together', 'debug multiple projects', 'configure multi-launch', 'test app with API', or 'setup simultaneous execution'. Covers Rider MultiLaunch, debug modes, and cross-device API testing. Make sure to use this skill whenever setting up .NET MAUI development environments with backend APIs. Not for single-project execution, CI/CD pipelines, or deployment configuration."
---

# Execucao de Multiplos Projetos (.NET MAUI + API)

> Configure a execucao simultanea de app .NET MAUI e API backend para testes de integracao em simuladores iOS e emuladores Android.

## Rules

1. **Configure MultiLaunch no Rider** — use a opcao "Run Multiple Projects" para executar API e app simultaneamente, porque testar integracao exige ambos rodando
2. **Selecione HTTPS para a API** — clique em Settings do projeto API e selecione o perfil HTTPS, porque o app precisa de conexao segura
3. **Escolha o target correto do app** — selecione iOS Simulator ou Android Emulator no MultiLaunch conforme o teste desejado, porque cada plataforma tem comportamento diferente
4. **Use "without debug" para a API quando nao precisar de breakpoints** — marque o checkbox no Rider (equivalente ao "Start Without Debugging" do Visual Studio), porque economiza recursos
5. **A API pode rodar em outra maquina** — use tuneis publicos (ngrok, etc.) para apontar o app no simulador para uma API remota, porque simuladores iOS no Mac podem consumir a API de um Windows
6. **Commit de URLs de tunel e seguro** — URLs de tuneis locais podem ser commitadas sem risco, porque sao temporarias e apontam para maquina local

## How to configure

### Rider — MultiLaunch

```
1. Botao direito em qualquer projeto → "Run Multiple Projects"
   OU
   Dropdown de execucao (setinha) → "Multi Launch" → "..." (editar)

2. Na tela de configuracao:
   - Adicione: SeuApp.Api (selecione HTTPS nas settings)
   - Adicione: SeuApp.App (selecione iOS Simulator ou Android)
   
3. Opcoes por projeto:
   - Checkbox "inseto" = executar SEM debug (without debugging)
   - Launch Action: "Immediately" | "After previous started" | "After previous finished" | "After port opened"

4. Clique OK → Dropdown mostra "MultiLaunch, SeuApp"
5. Clique Play (executar) ou Debug (inseto)
```

### Visual Studio — Multiple Startup Projects

```
1. Solution Explorer → botao direito na Solution
2. Properties → Common Properties → Startup Project
3. Selecione "Multiple startup projects"
4. Configure Action: "Start" ou "Start without debugging" para cada projeto
```

### URL da API para simulador/emulador

```csharp
// appsettings ou constante no app
// Para tunel publico (cross-machine):
public const string ApiBaseUrl = "https://seu-tunel.ngrok.io";

// Para emulador Android local:
public const string ApiBaseUrl = "https://10.0.2.2:7001";

// Para simulador iOS local:
public const string ApiBaseUrl = "https://localhost:7001";
```

## Example

**Cenario: Testar app iOS no Mac com API no Windows**

1. No Windows: execute a API (Swagger aberto confirmando funcionamento)
2. Crie um tunel publico apontando para a API
3. No Mac/Rider: configure `ApiBaseUrl` com a URL do tunel
4. No Rider: configure MultiLaunch apenas com o App (iOS Simulator)
5. Execute e teste — chamadas HTTP vao para o Windows via tunel

## Heuristics

| Situacao | Faca |
|----------|------|
| API e app na mesma maquina | MultiLaunch com ambos, localhost |
| API em outra maquina | Execute so o app, API via tunel publico |
| Nao precisa de breakpoints na API | Marque "without debug" para a API |
| Quer controlar ordem de inicializacao | Use "After previous started" no Rider |
| Testando em Android e iOS | Configure dois MultiLaunch profiles separados |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Executar app sem API rodando | Sempre confirme API ativa antes de testar |
| Criar banco de dados duplicado em cada maquina | Reutilize a API e banco de uma maquina via tunel |
| Ignorar falta de feedback visual apos chamadas HTTP | Adicione loading indicators e mensagens de sucesso/erro |
| Commitar URLs de producao no codigo | Use configuracao por ambiente (appsettings.Development.json) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
