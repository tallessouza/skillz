# Deep Explanation: Signal Store para Estado de Usuário

## Por que um Service e nao um componente?

O instrutor enfatiza que o melhor local para salvar informacoes compartilhadas e dentro de um **service**, porque voce consegue injetar esse service em qualquer componente que queira consumir essas informacoes. Com `providedIn: 'root'`, a instancia e unica — nao importa quantos lugares injetem, sera sempre a mesma instancia.

## Signal vs BehaviorSubject

O instrutor faz uma ponte direta com o projeto anterior do curso (to-do list), onde usavam BehaviorSubject. Com Signals, o conceito e parecido: voce guarda um valor, e quando ele muda, quem depende dele e notificado. A diferenca e que Signals integram nativamente com o sistema de deteccao de mudancas do Angular — sem necessidade de `async` pipe ou `subscribe()`.

## Por que `private readonly` + `asReadOnly()`?

O instrutor explica com clareza: "Quem injetar esse servico, eu nao quero que ele tenha acesso direto a esse signal e consiga fazer um `.set()` manualmente. Senao, varios componentes podem alterar esse signal e fica uma bagunca para dar manutencao."

O padrao e:
1. Signal privado — ninguem acessa diretamente
2. Exposicao via `asReadOnly()` — permite leitura, computed, template binding, mas impede escrita
3. Metodo dedicado `setUserInfos()` — unico ponto de mutacao

## Por que inicializar com `undefined`?

Quando um signal comeca com `undefined`, fluxos dependentes (computed, rxResource) nao sao disparados. So quando ele recebe um valor real e que o fluxo acontece. Isso evita execucoes desnecessarias no carregamento inicial.

## Destructuring do response

O instrutor mostra um pattern de JavaScript para extrair propriedades aninhadas:

```typescript
tap(({ user: { id, name, email } }) => {
  this._userInfosStore.setUserInfos({ id, name, email });
})
```

Isso e equivalente a `response.user.id`, `response.user.name`, etc., mas em formato mais enxuto.

## Por que popular no service de API e nao no componente?

O instrutor e explicito: "Eu nao quero colocar esse processamento dentro de um componente. Ja deixo aqui que vai ser automatico — sempre que o usuario fizer login, eu vou querer popular o UserInfoStore." Isso desacopla a logica de persistencia de estado de qualquer componente especifico.

## O problema de persistencia

O instrutor demonstra um bug importante: ao recarregar a pagina, o nome do usuario desaparece. Isso acontece porque o service e resetado quando a aplicacao recarrega, e o signal volta para `undefined`. A solucao (persistir em localStorage/sessionStorage) e tratada na proxima aula. Este e um lembrete importante de que Signals vivem apenas em memoria.

## `private` vs `readonly` na injecao do componente

- No service de API: `private readonly` — o store nao precisa ser acessado no template
- No Header component: apenas `readonly` (sem `private`) — porque o template precisa acessar a instancia diretamente (`_userInfosStore.userInfos()?.name`)