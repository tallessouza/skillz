# Deep Explanation: Monorepo com TurboRepo

## Por que monorepo?

O instrutor explica que monorepo e "basicamente um nome bonito para manter todos os pacotes e aplicacoes que pertencem ao mesmo projeto dentro do mesmo repositorio". Nao e uma ferramenta magica — e uma estrategia de organizacao.

### Quando usar monorepo

- **Sim:** Time fullstack que trabalha tanto no backend quanto no frontend. Quando o mesmo desenvolvedor mexe em ambos, faz sentido ter tudo junto.
- **Nao:** Times bem separados de backend e frontend. Nesse caso, "voce acaba misturando muito as issues, pull requests e muitos commits dentro de uma mesma codebase".

### Monorepo nao exige ferramenta

O instrutor enfatiza: "a gente nao precisa usar ferramenta nenhuma para monorepo, porque monorepo basicamente pode ser duas pastas, projeto backend e frontend". Ferramentas como TurboRepo e workspaces sao otimizacoes, nao requisitos.

## Workspaces: o problema das dependencias duplicadas

Sem workspaces, se voce tem ESLint instalado tanto no frontend quanto no backend, o codigo do ESLint fica duplicado em ambos os `node_modules`. Workspaces resolvem isso — todos os gerenciadores de pacotes (NPM, Yarn, PNPM, Bun) suportam.

O PNPM usa um arquivo separado `pnpm-workspace.yaml`, enquanto NPM e Yarn definem workspaces dentro do `package.json`.

## TurboRepo: cache inteligente

A analogia do instrutor: "Imagina que eu fiz uma funcionalidade nova no frontend, mas nao mexi no backend. O TurboRepo vai detectar automaticamente que nao houve nenhuma alteracao no backend e vai fazer o build so no frontend."

### Como o cache funciona

O TurboRepo guarda um cache local que registra: "da ultima vez que rodou o comando de lint, tinha esses arquivos aqui. Algum deles foi modificado? Nao? Entao nao tem porque rodar de novo."

### Pipeline e dependsOn

O `dependsOn: ["^build"]` no turbo.json significa: se o projeto A depende do projeto B, e ambos tem comando de build, o TurboRepo executa primeiro o build do projeto B. O `^` indica dependencias transitivas.

### Outputs para cache

O campo `outputs` (ex: `.next/**`, `dist/**`) serve para duas coisas:
1. O TurboRepo saber se o build ja foi executado
2. Determinar qual pasta guardar em cache

### Persistent no dev

O `persistent: true` informa ao TurboRepo que o comando `dev` nao termina sozinho — fica executando ate o usuario parar. Sem isso, o TurboRepo tentaria esperar o comando terminar.

## Escolha do PNPM

O instrutor escolheu PNPM por ser "um pouco mais rapido, porque gerencia cache um pouquinho melhor". Sobre o Bun: "ainda tem alguns bugs nessa parte de monorepo e integracao com o Next" (contexto: meados de 2024).

## Escopo de pacotes (@scope)

Todos os pacotes dentro de um monorepo precisam de um prefixo `@scope/` unico. Isso evita conflitos com pacotes do npm registry e permite que o workspace resolva dependencias internas corretamente.

## Package.json da raiz

O package.json na raiz do monorepo "nao determina as dependencias que cada uma das aplicacoes vai ter". Ele contem apenas pacotes para configuracao do monorepo em si. Dependencias especificas ficam no package.json de cada app/pacote.