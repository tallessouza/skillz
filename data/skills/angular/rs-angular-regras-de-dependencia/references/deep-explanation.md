# Deep Explanation: Regras de Dependencia

## O que e uma dependencia?

O instrutor define dependencia de forma pratica: um componente consumir outro componente, um componente consumir uma service, uma service consumir outra service. Sempre que um artefato precisa de outro para funcionar, existe uma dependencia.

## A logica por tras das regras

### Feature → Core/Shared (OK) | Feature → Feature (PROIBIDO)

A Feature e o contexto de negocio (dashboard, users, products). Se uma feature depende de outra, remover ou modificar uma feature pode quebrar outra — isso cria um efeito cascata que torna o projeto fragil.

O instrutor usa um exemplo concreto: o componente **dashboard** consome o componente **user-list** (de outra feature) para mostrar uma lista de usuarios. Ele reconhece que isso acontece no dia a dia em aplicacoes complexas. Porem, a regra e clara: **se eu remover o user-list do dashboard, o dashboard TEM que funcionar normalmente.**

> "O ideal seria esse componente ser totalmente isolado e consumir apenas os seus componentes internos. Mas no dia a dia, em aplicacoes complexas, isso e muito difícil de acontecer."

Essa e uma concessao pragmatica do instrutor — ele reconhece a realidade, mas reforça que a regra deve ser respeitada: o componente consumidor nao pode depender do consumido para funcionar.

### Shared → Core (OK) | Shared → Feature (PROIBIDO)

A Shared contem componentes reutilizaveis (button, modal, card). Se um componente Shared depende de uma Feature, ele perde a reusabilidade — so funciona no contexto daquela feature especifica.

O instrutor da o exemplo: nao posso pegar o seletor `<app-dashboard>` e usar dentro do `<app-button>` ou `<app-modal>`. O button ficaria dependente da feature dashboard.

A consequencia positiva dessa regra: **componentes na Shared acabam sendo isolados e autossuficientes para seus propositos**, melhorando a reusabilidade.

### Core → Ninguem

Core e a fundacao. Auth, HTTP interceptors, guards — tudo que esta na Core funciona sozinho. Se Core dependesse de Shared ou Feature, qualquer mudanca nessas camadas poderia quebrar a base do sistema.

## A mudanca de mentalidade

O instrutor enfatiza que essas regras criam uma "mudanca de mentalidade" que leva a componentes melhor estruturados:

> "Essa mudanca de mentalidade faz nos criarmos componentes melhores estruturados, baseados no contexto deles, baseado nas funcionalidades deles."

Nao e apenas uma regra tecnica — e uma forma de pensar sobre isolamento e responsabilidade.

## Resumo visual do fluxo de dependencias

```
Feature ──→ Core    ✅
Feature ──→ Shared  ✅
Feature ──→ Feature ❌ (toleravel se nao quebra, ideal e evitar)

Shared  ──→ Core    ✅ (com minimo acoplamento)
Shared  ──→ Feature ❌

Core    ──→ (nada)  ✅
Core    ──→ Shared  ❌
Core    ──→ Feature ❌
```