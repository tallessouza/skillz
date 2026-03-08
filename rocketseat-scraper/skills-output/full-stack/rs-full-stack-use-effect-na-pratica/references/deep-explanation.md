# Deep Explanation: UseEffect na Prática

## Modelo mental do useEffect

O useEffect existe porque componentes React são funções puras que descrevem UI. Qualquer coisa que não seja "calcular o que mostrar na tela" é um **efeito colateral** — e efeitos colaterais precisam de um lugar controlado para acontecer.

O instrutor enfatiza um ponto sutil: **useEffect fica perto do return**. Isso não é apenas convenção estética. A ordem no componente reflete a ordem mental de execução:

1. Estados são declarados (`useState`)
2. Variáveis derivadas são calculadas
3. Efeitos colaterais são registrados (`useEffect`) — executam **após** o render
4. JSX é retornado (`return`)

Colocar useEffect logo após os estados e antes do return comunica: "primeiro processe tudo, depois registre os efeitos, depois renderize."

## Quando o useEffect dispara

O instrutor explica duas situações:

### 1. Quando o componente é renderizado
Toda vez que o React monta o componente na tela, os useEffects com array vazio `[]` executam. O instrutor demonstra isso salvando o arquivo várias vezes — cada save causa um hot reload, que re-monta o componente, e o `console.log('Oi')` aparece novamente.

**Detalhe importante que o instrutor corrige em tempo real:** ele diz "uma vez só" e imediatamente se corrige — "não, eu digo uma vez, mas toda vez que o componente for renderizado." Isso captura uma confusão comum:

- Array vazio `[]` NÃO significa "uma vez na vida do app"
- Significa "uma vez por montagem do componente"
- Se o componente desmonta e remonta (por navegação, por exemplo), o efeito roda de novo

### 2. Quando dependências mudam
Se o array contém variáveis (ex: `[searchTerm]`), o React compara o valor atual com o anterior. Se mudou, executa o efeito novamente. Isso é o mecanismo de **reatividade** do useEffect.

## Os dois parâmetros

O useEffect é uma função que recebe exatamente dois argumentos:

1. **Callback function** — a lógica do efeito. Roda após o render.
2. **Dependency array** — lista de valores que o React observa. Controla QUANDO o efeito re-executa.

A combinação desses dois parâmetros cria todo o poder do useEffect:

| Array de dependências | Comportamento |
|-----------------------|--------------|
| Omitido (sem segundo parâmetro) | Executa após TODA renderização — quase sempre um bug |
| `[]` (array vazio) | Executa apenas no mount (primeira renderização) |
| `[a, b]` (com valores) | Executa no mount E quando `a` ou `b` mudam |

## Por que omitir o array é perigoso

Sem o array de dependências, o useEffect roda após cada render. Num componente que re-renderiza frequentemente (por estado, props, ou contexto), isso pode causar:

- Requests HTTP duplicados (dezenas de fetches)
- Event listeners empilhados
- Performance degradada
- Loops infinitos (se o efeito atualiza estado que causa re-render)

O instrutor demonstra visualmente: cada vez que salva o arquivo, um novo "Oi" aparece no console. Com array vazio, isso é controlado. Sem array, seria descontrolado em produção.

## A demonstração do instrutor

O instrutor usa o DevTools (inspecionar → console) para mostrar o comportamento em tempo real:

1. Adiciona `console.log('Oi')` dentro do useEffect com array vazio
2. Salva o arquivo
3. Mostra no console que "Oi" aparece
4. Salva novamente — "Oi" aparece de novo (hot reload = remontagem)
5. Explica que cada save causa re-renderização, e o useEffect com `[]` executa no mount

Essa demonstração visual conecta o conceito abstrato ao comportamento real observável no browser.