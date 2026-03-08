# Deep Explanation: Encerramento — Fundamentos do React

## Por que fundamentos importam

O instrutor enfatiza que os fundamentos do React são "pilares extremamente importantes" que "você vai usar em qualquer aplicação". Isso não é retórica — é uma observação prática: todo componente React, do mais simples ao mais complexo, usa alguma combinação de JSX, props, estado e efeitos.

## A progressão pedagógica

A abordagem do curso segue uma progressão deliberada:

1. **Fundamentos isolados** — cada pilar estudado individualmente para compreensão profunda
2. **Projeto prático** — todos os pilares combinados em uma aplicação real

Essa separação é intencional: tentar aprender os pilares ENQUANTO constrói um projeto gera confusão entre "não entendo React" e "não entendo o domínio do projeto". Estudar fundamentos primeiro remove essa ambiguidade.

## O que significa "dominar" cada pilar

### JSX
Não é apenas "HTML dentro de JavaScript". É uma abstração que permite compor UI de forma declarativa. Dominar JSX significa entender que `{}` abre um contexto JavaScript dentro da marcação, que todo JSX retorna um elemento (ou fragmento), e que a renderização condicional é apenas JavaScript normal (ternários, `&&`, early returns).

### Componentes
Funções que retornam JSX. Dominar componentes significa saber quando extrair um trecho de JSX para um novo componente (responsabilidade única), como nomear componentes de forma descritiva, e que cada componente deve ser independente o suficiente para ser testado isoladamente.

### Props
O mecanismo de comunicação pai → filho. Dominar props significa usar destructuring no parâmetro, definir interfaces/types quando em TypeScript, e nunca mutar props recebidas.

### Estado (useState)
O mecanismo que faz a UI reagir a mudanças. Dominar estado significa entender que `setState` não muta — substitui. Que atualizações baseadas no estado anterior devem usar a forma funcional `setState(prev => ...)`. Que estado deve ser o mais local possível (colocação de estado).

### Efeitos (useEffect)
O mecanismo para side effects (API calls, timers, subscriptions). Dominar useEffect significa entender o array de dependências, saber quando o cleanup é necessário, e reconhecer que useEffect roda DEPOIS da renderização.

## Sinal de prontidão para projetos

Se ao ler um componente React você consegue identificar imediatamente:
- Onde está o estado
- Como os dados fluem via props
- Quais efeitos existem e por quê
- Como a UI responde a eventos

Então você está pronto para o próximo módulo: construir um projeto completo.