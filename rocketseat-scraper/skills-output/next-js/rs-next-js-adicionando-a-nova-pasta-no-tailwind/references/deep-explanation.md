# Deep Explanation: Tailwind Content Paths

## Por que isso acontece

O Tailwind CSS usa um processo chamado **purging** (ou tree-shaking) para remover classes CSS nao utilizadas do bundle final. Para saber quais classes estao sendo usadas, ele escaneia os arquivos listados no array `content` do `tailwind.config`.

Quando voce cria uma pasta nova (como `templates/`) e coloca componentes com classes Tailwind la dentro, mas nao adiciona essa pasta ao `content`, o Tailwind simplesmente nao sabe que esses arquivos existem. Resultado: todas as classes usadas nesses arquivos sao consideradas "nao utilizadas" e removidas do CSS.

## O sintoma enganoso

O instrutor destaca que esse e um problema particularmente traicoeiro porque:

1. **Nao ha erro no console** — o projeto roda normalmente
2. **O HTML e renderizado** — os componentes aparecem, so sem estilo
3. **Funcionava antes** — o que confunde porque o codigo nao mudou, so a localizacao

A analogia e: voce mudou de endereco mas nao avisou o carteiro. As cartas (classes CSS) continuam sendo entregues no endereco antigo.

## Contexto da aula

Na aula anterior, o instrutor refatorou a landing page movendo codigo de `src/components/` para uma nova pasta `src/templates/`. A pasta `components/` ja estava mapeada no Tailwind config (vem como default no Next.js), mas `templates/` nao.

O fluxo foi:
1. `src/components/` continha todas as secoes da landing page
2. Criou `src/templates/LandingPage/` e moveu a composicao para la
3. `src/pages/index` agora importa de `templates/` em vez de `components/`
4. Estilos quebraram porque `templates/` nao estava no `content`

## O que vem por padrao no Next.js

O `tailwind.config` padrao do Next.js mapeia:
- `./src/pages/**/*` — Pages Router
- `./src/app/**/*` — App Router
- `./src/components/**/*` — componentes

Qualquer pasta alem dessas precisa ser adicionada manualmente.

## Regra geral

> "Toda vez que voce fizer esse tipo de reestruturacao interna, criar pastas novas, diretorios novos dentro do seu projeto, lembre de adicionar na configuracao do Tailwind."

Isso vale para qualquer framework que use Tailwind, nao apenas Next.js.