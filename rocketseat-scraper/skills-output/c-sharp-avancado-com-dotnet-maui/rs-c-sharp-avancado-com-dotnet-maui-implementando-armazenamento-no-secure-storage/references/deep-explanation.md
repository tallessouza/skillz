# Deep Explanation: Secure Storage no .NET MAUI

## Por que SecureStorage e não Preferences?

O instrutor enfatiza que tokens são **informações sensíveis** que precisam ser armazenados em um "cofre seguro criptografado". O `Preferences` armazena dados em texto plano no dispositivo, enquanto o `SecureStorage` usa:

- **Android:** Android Keystore — criptografia baseada em hardware
- **iOS:** Keychain — cofre nativo da Apple
- **Windows:** DPAPI (Data Protection API)

## Diferença fundamental: Async vs Sync

O `Preferences` é síncrono (`Get`, `Set` — retorno imediato). O `SecureStorage` é assíncrono (`GetAsync`, `SetAsync` — retorna `Task`) porque precisa se comunicar com o cofre criptografado do sistema operacional, que é uma operação de I/O.

Isso impacta toda a assinatura dos métodos:
- `Save` retorna `Task` (não `void`)
- `Get` retorna `Task<Tokens>` (não `Tokens`)
- `Clear` pode ser `void` porque `RemoveAll()` é síncrono

## GetAsync vs Preferences.Get

O instrutor destaca uma diferença sutil: o `Preferences.Get` exige dois parâmetros (chave + valor default), enquanto o `SecureStorage.GetAsync` exige apenas a chave. Se a chave não existir, retorna `null`. Como o código interno controla esses valores (o usuário não interage diretamente), pode-se usar o operador `!` (null-forgiving) para suprimir warnings do compilador.

## Configuração do Android Manifest

No arquivo `Platforms/Android/AndroidManifest.xml`, é necessário trocar `android:allowBackup="true"` para `android:allowBackup="false"`. Sem isso, o SecureStorage pode não funcionar corretamente no Android.

Para acessar como XML no Visual Studio: botão direito → Abrir com → Android XML file.

## Limitação do iOS Simulator

O SecureStorage **não funciona no simulador iOS**. Funciona apenas em dispositivos físicos. Para contornar no desenvolvimento, usa-se um fallback (ex: Preferences apenas em modo debug/simulador). O instrutor menciona que mostrará a solução de contorno na aula seguinte.

## Padrão de interface + implementação

O instrutor segue o mesmo padrão usado para Preferences: cria uma interface (`ITokenStorage`) e uma classe implementando (`TokenStorage`). Isso permite:
- Injeção de dependência
- Trocar implementação facilmente (ex: fallback para simulador)
- Testabilidade

## Dica do Visual Studio: Multi-cursor

O instrutor mostra um atalho útil: segurar `Alt` + clicar e arrastar para criar múltiplos cursores. Isso permite escrever `await` em várias linhas simultaneamente.