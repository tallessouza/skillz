# Code Examples: Introducao a Formacao .NET MAUI

## Estrutura de Solution Recomendada

```
PlanShare.sln
│
├── src/
│   ├── PlanShare.API/                 # ASP.NET Web API
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   ├── PlanShare.Application/         # Casos de uso
│   │   ├── UseCases/
│   │   └── Services/
│   │
│   ├── PlanShare.Domain/              # Entidades e interfaces
│   │   ├── Entities/
│   │   └── Repositories/
│   │
│   ├── PlanShare.Infrastructure/      # Implementacoes externas
│   │   ├── DataAccess/
│   │   ├── AzureStorage/
│   │   └── GoogleAuth/
│   │
│   └── PlanShare.App/                 # .NET MAUI Application
│       ├── Pages/
│       │   ├── OnboardingPage.xaml
│       │   ├── LoginPage.xaml
│       │   ├── RegisterPage.xaml
│       │   ├── DashboardPage.xaml
│       │   ├── CreateTaskPage.xaml
│       │   ├── ProfilePage.xaml
│       │   └── InviteCodePage.xaml
│       ├── Components/
│       ├── Themes/
│       │   ├── LightTheme.xaml
│       │   └── DarkTheme.xaml
│       ├── Services/
│       │   ├── ApiService.cs
│       │   └── WebSocketService.cs
│       └── MauiProgram.cs
│
└── tests/
    ├── PlanShare.API.Tests/
    └── PlanShare.Application.Tests/
```

## Telas do Aplicativo (Mapeamento Figma → Endpoints)

Cada tela do Figma implica endpoints na API:

```
Tela                    → Endpoints Necessarios
─────────────────────────────────────────────────
Onboarding              → (nenhum — tela estatica)
Login (email/senha)     → POST /api/auth/login
Login com Google        → POST /api/auth/google
Criar conta             → POST /api/auth/register
Esqueci senha           → POST /api/auth/forgot-password
Dashboard               → GET /api/tasks
Criar tarefa            → POST /api/tasks
Editar tarefa           → PUT /api/tasks/{id}
Deletar tarefa          → DELETE /api/tasks/{id}
Upload arquivo          → POST /api/files/upload
Editar perfil           → PUT /api/profile
Alterar senha           → PUT /api/profile/password
Deletar conta           → DELETE /api/profile (fila de mensagens)
Foto de perfil          → POST /api/profile/photo
Gerar codigo convite    → POST /api/invite/generate
Usar codigo convite     → POST /api/invite/join
Compartilhamento        → WebSocket (SignalR) /hubs/tasks
```

## Configuracao de Dispositivo Android (USB)

```bash
# Verificar se o dispositivo Android esta conectado
adb devices

# Output esperado:
# List of devices attached
# XXXXXXXX    device
```

No Visual Studio:
1. Conecte o dispositivo Android via USB
2. Ative "Depuracao USB" no dispositivo (Configuracoes > Opcoes do Desenvolvedor)
3. O Visual Studio detecta automaticamente o dispositivo
4. Selecione o dispositivo no dropdown de target e execute

## Configuracao de Simulador iOS (macOS)

No Rider ou Visual Studio for Mac:
1. Abra Xcode > Preferences > Components
2. Baixe o simulador iOS desejado
3. No Rider, selecione o simulador no dropdown de target
4. Execute — o simulador abre automaticamente

## Temas Light/Dark Mode (.NET MAUI)

```xml
<!-- LightTheme.xaml -->
<ResourceDictionary>
    <Color x:Key="PrimaryColor">#6200EE</Color>
    <Color x:Key="BackgroundColor">#FFFFFF</Color>
    <Color x:Key="TextColor">#000000</Color>
    <Color x:Key="SurfaceColor">#F5F5F5</Color>
</ResourceDictionary>

<!-- DarkTheme.xaml -->
<ResourceDictionary>
    <Color x:Key="PrimaryColor">#BB86FC</Color>
    <Color x:Key="BackgroundColor">#121212</Color>
    <Color x:Key="TextColor">#FFFFFF</Color>
    <Color x:Key="SurfaceColor">#1E1E1E</Color>
</ResourceDictionary>
```

## Funcionalidades Chave — Resumo Tecnico

### Upload de Arquivos
- API recebe arquivo via multipart/form-data
- Valida tipo real (nao apenas extensao — verifica magic bytes)
- Armazena no Azure Blob Storage

### Login com Google (OAuth)
- App obtem token do Google
- Envia token para API (POST /api/auth/google)
- API valida token com Google, cria/atualiza usuario, retorna JWT
- 97% do trabalho esta na API

### WebSocket (SignalR)
- Hub para tarefas compartilhadas
- Quando usuario A cria/edita tarefa, usuario B recebe em tempo real
- Usado tambem para codigo de convite e compartilhamento

### Fila de Mensagens
- Usado para operacoes pesadas como deletar conta
- API recebe request, enfileira, responde imediatamente
- Worker processa a fila (deleta dados, arquivos, etc.)