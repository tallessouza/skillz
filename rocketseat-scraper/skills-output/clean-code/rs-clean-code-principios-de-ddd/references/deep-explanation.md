# Deep Explanation: Princípios de DDD

## O que DDD NÃO é

DDD não é arquitetura. Diego enfatiza que DDD e arquiteturas como Clean Architecture ou Ports & Adapters pertencem a **momentos diferentes** do projeto:

- **DDD** = o desenho, o passo antes. Você pensa no QUE vai existir.
- **Arquitetura** = a mão na massa. Você já sabe o que vai desenvolver e decide COMO estruturar.

Comparar DDD com Clean Architecture é como comparar a planta de uma casa com o tipo de tijolo usado.

## Domínio: o problema e seu contexto

Domínio não é algo palpável que vira arquivo ou classe. É **tudo que toca a problemática** que você está resolvendo. Exemplo da Rocketseat: o domínio é "educação em programação" — todo o ambiente, as problemáticas, os processos.

## Subdomínios: áreas dentro do problema

Para um e-commerce, Diego lista: logística, faturamento, pagamento, estoque. Cada um é uma área de entendimento diferente dentro do domínio maior.

Diego faz uma observação importante: subdomínios podem se mapear para microserviços numa arquitetura de infra, mas esse mapeamento é uma decisão posterior. No momento do DDD, você não está pensando em infraestrutura.

## Como identificar entidades e casos de uso

A técnica é **conversar com domain experts** — pessoas com conhecimento profundo de cada subdomínio. Da fala natural deles, você extrai:

- **Substantivos recorrentes** → candidatos a entidades
- **Verbos/ações** → candidatos a casos de uso

Exemplo real do Diego: um domain expert de faturamento diz "nosso dia a dia é pegar as **ordens de pedido** e **emitir** **notas fiscais**". Dessa frase:
- Entidades: `OrdemDePedido`, `NotaFiscal`
- Caso de uso: `EmitirNotaFiscal`

Diego alerta: não tire conclusões da primeira frase. Investigue mais fundo para confirmar que algo é realmente uma entidade.

## A sacada mais importante: nomes mudam por contexto

Diego considera esta a contribuição mais valiosa do DDD para Clean Code. O exemplo:

- No checkout → a pessoa é **comprador**
- Na logística → a mesma pessoa é **destinatário**
- No banco de dados → pode ser a mesma tabela

No código, são entidades diferentes com nomes diferentes, porque o **papel** muda conforme o subdomínio.

O anti-pattern clássico: criar `User` como primeira entidade e nunca mais conseguir entender o que aquilo representa em cada contexto.

## Quando estudar DDD a fundo

Diego dá um conselho pragmático: DDD só faz sentido estudar a fundo (livro do Eric Evans, cursos completos) quando você **já sentiu a dor** que DDD resolve. Sem experiência prévia com problemas de modelagem de domínio, o estudo é perda de tempo — falta contexto para absorver.

## Conceitos mencionados mas não aprofundados

Diego menciona que DDD tem muitos outros conceitos: aggregates, bounded contexts, value objects. Nesta aula ele foca apenas nos quatro conceitos fundamentais: domínio, subdomínio, entidade e caso de uso.