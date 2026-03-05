# Deep Explanation: Event to Command em .NET MAUI

## Por que nao usar OnAppearing no code-behind?

O instrutor demonstra que a abordagem "funcional" — salvar referencia da ViewModel como propriedade da classe e chamar metodos no `OnAppearing` — funciona tecnicamente, mas e "feiozinha" e nada elegante. O problema fundamental e que o code-behind passa a conhecer detalhes da ViewModel, quebrando a separacao MVVM.

O instrutor literalmente faz Ctrl+Z apos mostrar o codigo, reforçando que aquele caminho nao deve ser seguido.

## O conceito de Evento

O instrutor faz questao de explicar que "a pagina ficar visivel" e um **evento**. Dado um evento, uma funcao e executada. Esse entendimento e crucial porque o CommunityToolkit oferece o `EventToCommandBehavior` — que transforma qualquer evento em uma chamada de comando.

## Truque para descobrir o nome do evento

O nome da funcao override e `OnAppearing`. O prefixo "On" funciona como "ao/quando". O nome do evento propriamente dito e so `Appearing`. Regra geral: qualquer funcao override que comece com "On" tem o evento correspondente sem esse prefixo.

## O bug do DelegatingHandler Singleton

### Fluxo que causa o erro

1. Usuario faz login → `ILoginApi` e usado → instancia de `PlanShareHandler` criada
2. Usuario navega para perfil → `IUserApi` e usado → **mesma instancia** do handler (Singleton)
3. Excecao: "The InnerHandler must be null. DelegatingHandler must not be reused or cached."

### Por que Singleton causa o problema

O `DelegatingHandler` e associado a um `HttpClient` especifico. Quando registrado como Singleton, a mesma instancia e compartilhada entre `ILoginApi` e `IUserApi`. O segundo uso tenta reatribuir o `InnerHandler`, que ja esta definido — causando a excecao.

### Por que Transient resolve

Com `AddTransient`, cada resolucao de `ILoginApi` ou `IUserApi` recebe sua propria instancia do handler, sem conflito.

### Dica de debugging do instrutor

O instrutor enfatiza: "nao precisa ficar desesperado com excecao. Le a mensagem com calma, 99.9% das vezes voce resolve." Ele tambem mostra como usar as "referencias" do Visual Studio (4 referencias ao handler) para entender onde o handler esta sendo reutilizado.

## Fluxo do PlanShareHandler no login

O instrutor faz F11 (step into) para mostrar que no momento do login:
- `AccessToken` e `RefreshToken` sao nulos (nao existe token antes do login)
- O `if` que verifica tokens impede que authorization header seja adicionado sem token
- Esse e o comportamento correto para login/registro

## Nota sobre compatibilidade de versao

O instrutor menciona que o `EventToCommandBehavior` funcionava perfeitamente em versoes anteriores do .NET MAUI, mas em alguma versao parou de disparar o evento `Appearing` via behavior. Ele nao sabe se e bug ou intencional. Se nao funcionar, ha um workaround simples (coberto na aula seguinte).