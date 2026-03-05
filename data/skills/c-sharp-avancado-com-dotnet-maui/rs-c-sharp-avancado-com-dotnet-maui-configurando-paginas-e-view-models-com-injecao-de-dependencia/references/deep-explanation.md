# Deep Explanation: DI em Pages e ViewModels (.NET MAUI)

## Por que nao fazer `new ViewModel()`?

O instrutor apresenta tres argumentos concretos:

### 1. Cadeia de dependencias
A ViewModel vai executar comandos que precisam de regras de negocio (use cases), que por sua vez se comunicam com a API, armazenam tokens internamente no app. Se voce faz `new ViewModel()`, vai precisar passar parametros no construtor manualmente: `new ViewModel(new UseCase(new ApiService(...)))` — vira uma bagunca.

### 2. Testes de unidade
Com DI, e muito mais simples fazer mock das dependencias e focar em uma coisa especifica nos testes. Igual se fosse uma API — testes precisam de DI.

### 3. Regras de negocio por plataforma (cenario real)
O instrutor relata experiencia propria: teve um cenario onde a regra de negocio mudava conforme o sistema operacional (Android vs iOS). Sem DI, o codigo ficaria cheio de `if (Android) ... else if (iOS) ...`. Com DI, use cases separados sao registrados e a injecao direciona para a instancia correta automaticamente.

## Singleton vs Scoped vs Transient em MAUI

### O problema do Singleton (demonstrado ao vivo)

O instrutor demonstra com a tela de login:
1. Registra `DoLoginViewModel` como Singleton
2. Navega para login, digita "Ellison Arley"
3. Pressiona botao voltar (sem querer)
4. Navega de volta para login — **o texto "Ellison Arley" ainda esta la**

Isso acontece porque Singleton cria a instancia uma unica vez. A mesma ViewModel (com o mesmo estado) e reutilizada.

O instrutor pondera: "nesse exemplo ate concordo que pode parecer util". Mas projeta para o cenario de **criar tarefa**: usuario preenche todos os dados, salva com sucesso, fecha a pagina. Quando clica em "criar nova tarefa", **todos os dados da tarefa anterior ainda estao la**. Isso e um problema real.

### Por que Scoped nao resolve em MAUI

Em uma API, Scoped cria instancias por request (chega request → abre escopo → instancia → resposta → escopo fecha). Duas requests simultaneas tem objetos diferentes.

Em MAUI, o "escopo" e o ciclo de vida do aplicativo inteiro (abriu → usou → fechou). Entao Scoped = Singleton na pratica.

### Transient resolve

Transient cria nova instancia **sempre**. Cada navegacao para a pagina recebe uma ViewModel limpa. O instrutor demonstra: digita "Ellison Arley", volta, navega de novo — campo vazio. Correto.

## CommunityToolkit.Maui — funcao tudo-em-um

A funcao `AddTransientWithShellRoute<TPage, TViewModel>(route)` faz tres coisas:
1. Registra a ViewModel no container de DI
2. Registra a Page no container
3. Associa a Page com a rota Shell

Sem o toolkit, voce precisaria fazer cada passo separadamente. O pacote `CommunityToolkit.Maui` precisa estar instalado para essa funcao estar disponivel.