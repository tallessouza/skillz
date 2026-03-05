# Deep Explanation: Testando PromptList e PromptCard

## Por que makeSut?

O instrutor introduz o padrao `makeSut` (System Under Test) desde o inicio, mesmo com poucos testes. A razao: quando o componente evolui e recebe novas props, voce altera apenas o makeSut, nao todos os testes. E um investimento pequeno que evita refatoracao futura.

## get vs query — a distincao critica

O instrutor cometeu o erro ao vivo: usou `getByRole` para verificar que um elemento NAO existe (lista vazia). O teste quebrou porque `get` lanca erro quando nao encontra. A correcao foi trocar para `queryByRole`, que retorna `null` silenciosamente.

**Regra mnemonica:**
- `get` = "eu SEI que existe, me da ele"
- `query` = "sera que existe? me diz"
- `find` = "vai existir eventualmente (async)"

## O problema do nome composto no link

Quando o PromptCard renderiza titulo E conteudo dentro do mesmo link, o `getByRole('link', { name: 'title01' })` falha. O Testing Library concatena todo o texto acessivel do link. O instrutor resolveu removendo o filtro `name` ja que so havia um link no componente. Alternativa: usar `{ name: /title01/ }` com regex parcial.

## A opiniao do instrutor sobre mockar navegacao

O instrutor mostrou COMO mockar `next/link` para testar redirecionamento via click, mas explicitamente disse que NAO recomenda. Seus argumentos:

1. Voce substitui o componente real por uma tag `<a>` nativa — nao esta testando o comportamento real
2. Precisa de `preventDefault`, `pushMock`, `prefetch` mock — muito setup para pouco valor
3. O `toHaveAttribute('href', path)` ja valida que o link aponta para o lugar certo
4. O comportamento de navegacao do Next.js e responsabilidade do framework, nao do seu componente

**Conclusao do instrutor:** "Tinha necessidade de fazer esse teste? Eu particularmente nao gosto. Pra mim nao faz muito sentido testar isso a nivel desse componente."

## Tipagem reaproveitada

Em vez de exportar o tipo `Prompt` separadamente, o instrutor reaproveitou a tipagem das props: `PromptListProps['prompts']`. Isso evita criar exports so para testes e mantem o contrato acoplado ao componente real.

## Validacao negativa como prova

O instrutor fez um teste invertido apos o teste passar: mudou o `toHaveLength(2)` para `toHaveLength(1)` e confirmou que quebrava. Tambem testou mudar o href no PromptCard para confirmar que o teste detectaria a mudanca. Essa pratica de "teste do teste" e importante para garantir que o teste nao e falso-positivo.