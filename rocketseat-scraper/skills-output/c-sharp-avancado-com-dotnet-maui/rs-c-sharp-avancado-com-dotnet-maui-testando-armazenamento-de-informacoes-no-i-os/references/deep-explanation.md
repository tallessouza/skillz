# Deep Explanation: iOS Secure Storage Simulator Workaround

## Por que SecureStorage nao funciona no simulador?

O SecureStorage do .NET MAUI utiliza o Keychain do iOS para armazenar dados de forma segura. O problema e que simuladores iOS nao implementam o Keychain de forma completa. Quando o app tenta acessar `SecureStorage.SetAsync()` em um simulador, uma excecao e lancada e o aplicativo crasha (fecha abruptamente).

Isso **nao acontece** em:
- Dispositivos iOS fisicos (iPhone real)
- Android (emulador ou fisico)
- Windows

## A abordagem oficial da Microsoft (e por que nao funcionar bem)

A documentacao oficial da Microsoft sugere:

1. Criar um arquivo `Entitlements.plist` em `Platforms/iOS/`
2. Habilitar o Keychain Sharing nesse arquivo
3. Configurar o Custom Entitlements nas propriedades do projeto

### Problemas encontrados na pratica:

**No Rider (JetBrains):** Nao da suporte adequado para arquivos `.plist`. Trabalhar com esse tipo de arquivo no Rider e extremamente frustrante — a IDE simplesmente nao oferece as ferramentas necessarias.

**No Visual Studio:** O campo "Custom Entitlements" que a documentacao menciona dentro de iOS > Bundle Signing simplesmente nao aparece para todos os usuarios. E um bug conhecido — em foruns da Microsoft, alguns desenvolvedores relatam que o campo aparece, outros nao. E mesmo para quem ve o campo e configura, o projeto pode parar de compilar.

## A solucao pragmatica: Preferences como fallback

A ideia e simples e elegante:

1. Preferences funciona em **qualquer plataforma** (Android, iOS fisico, iOS simulador)
2. SecureStorage e o ideal para tokens, mas nao funciona no simulador
3. Entao: detectar se estamos em simulador iOS e usar Preferences nesse caso

### Por que isso e aceitavel?

- O simulador e um **ambiente de desenvolvimento controlado** — nao e producao
- Os dados armazenados no Preferences do simulador nao representam risco de seguranca real
- A interface (`ITokenStorage`) garante que o resto do app nao sabe qual implementacao esta sendo usada
- Quando um iPhone fisico estiver disponivel, basta remover a classe alternativa e a condicional

## Detalhes tecnicos da implementacao

### Mantendo a assinatura async

A interface `ITokenStorage` define metodos como `Task SaveAsync()` e `Task<TokensRecord> GetAsync()`. O Preferences do .NET MAUI e sincrono. Para conciliar:

- **Metodos void async:** Usar `return Task.CompletedTask` — indica que a task foi completada com sucesso, sem necessidade de `async`/`await`
- **Metodos com retorno async:** Usar `return Task.FromResult(valor)` — encapsula o resultado sincrono dentro de uma Task

Nao e necessario (nem correto) mudar a assinatura da interface para `void` ou remover o `Task`, porque a interface e compartilhada com `TokensStorage` que realmente usa operacoes assincronas.

### DeviceInfo — a classe de deteccao

`DeviceInfo` e uma classe nativa do .NET MAUI que fornece informacoes sobre o dispositivo:
- `DeviceInfo.Platform` — retorna `DevicePlatform.iOS`, `DevicePlatform.Android`, etc.
- `DeviceInfo.DeviceType` — retorna `DeviceType.Physical` ou `DeviceType.Virtual`

"Virtual" e o termo que o .NET MAUI usa para simuladores/emuladores.

## Nota sobre UserStorage vs TokenStorage

O `UserStorage` usa Preferences e funciona em qualquer plataforma sem necessidade de condicional. Apenas o `TokenStorage` (que usa SecureStorage) precisa do workaround. Isso porque dados de usuario (nome, email) nao sao considerados sensiveis da mesma forma que tokens de autenticacao.

## Diferenca entre Rider e Visual Studio para iOS

O instrutor destaca que para trabalhar com iOS no .NET MAUI, especialmente com arquivos `.plist` e configuracoes de bundle signing, o Visual Studio oferece uma experiencia melhor que o Rider. No entanto, o Rider e preferido para desenvolvimento geral em C#/.NET.

Para esta aula especificamente, o instrutor usou:
- **Windows + Visual Studio** para mostrar a tentativa com Entitlements.plist
- **Mac + Rider** para executar e debugar no simulador iOS

Isso porque o simulador iOS so roda no macOS, mas o Rider no Mac nao lida bem com `.plist`.