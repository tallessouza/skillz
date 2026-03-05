# Deep Explanation: Primeiro App .NET MAUI no Windows

## Por que dispositivo fisico e nao emulador

O instrutor enfatiza fortemente o uso de dispositivo fisico por duas razoes:

1. **Confiabilidade**: Emuladores nem sempre sao confiaveis. O instrutor relata que durante sua carreira ja viu aplicativos que nao funcionavam no emulador mas funcionavam perfeitamente no dispositivo fisico. O problema era do emulador, nao do app.

2. **Acesso a hardware**: O curso vai ensinar acesso a camera do dispositivo. Emuladores nao tem camera real, entao seria impossivel testar essa funcionalidade.

Nao precisa ser um Android potente — um intermediario como o Moto G24 funciona perfeitamente.

## API Level vs Numero da Versao

A Google usa dois sistemas de numeracao:

- **Numero da versao** (ex: Android 14): marketing, para o publico geral saber qual versao esta usando. Cada versao recebe um nome de sobremesa (Android 14 = "Upside Down Cake").
- **API Level** (ex: 34): versao tecnica da API do Android para desenvolvedores. E o que determina quais recursos do sistema operacional (camera, sensores, etc.) estao disponiveis.

Para desenvolvimento, sempre olhar o API Level, nao o numero de marketing.

## A questao do iOS e dispositivo fisico

O instrutor explica por que no Mac vai usar simulador em vez de dispositivo fisico para iOS:

- Para usar iPhone como dispositivo fisico, precisa de conta de desenvolvedor Apple
- A conta custa $99/ano
- O processo envolve: criar conta, pagar taxa, pegar ID do dispositivo, cadastrar no portal da Apple, gerar executavel, baixar e instalar
- E um processo burocrático, nao dificil, mas chatinho
- No curso, usa simulador no Mac para evitar essa burocracia

## Organizacao da solucao

O instrutor separa os projetos em pastas semanticas dentro de `Source/`:
- `BackEnd/` — API
- `Shared/` — codigo compartilhado
- `Mobile/` — app MAUI

Importante: criar a pasta tanto na solucao do Visual Studio quanto no sistema de arquivos. Criar so na solucao nao cria a pasta fisica.

Essa organizacao tambem facilita futuros pipelines de CI/CD e permite adicionar outros projetos (ex: front-end web) de forma organizada.

## Convencao de nomes

- API: `PlanShare.API`
- App: `PlanShare.App`

Seguindo o padrao `{NomeProjeto}.{Tipo}` para manter consistencia.

## Primeira compilacao

A primeira vez que o projeto e compilado para um dispositivo, o Visual Studio demora mais porque precisa:
- Compilar todo o projeto do zero
- Empacotar o APK
- Transferir via USB
- Instalar no dispositivo

Compilacoes subsequentes sao mais rapidas por causa do cache.