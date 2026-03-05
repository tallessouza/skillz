# Deep Explanation: Configurando ESLint

## O que e ESLint

ESLint vem de ECMAScript Lint. "Lint" e o processo de padronizar codigo. O nome historicamente vem de uma ferramenta Unix que analisava codigo C em busca de problemas.

## Por que padronizar

O instrutor destaca um ponto fundamental: **nao importa qual padrao voce prefere, o que importa e que exista UM padrao no projeto.** Em times, cada pessoa tem preferencias diferentes:

- Ponto e virgula: facultativo em JavaScript, uns colocam, outros nao
- Aspas: simples vs duplas
- Indentacao: tabs vs espacos, 2 espacos vs 4 espacos

O problema nao e qual escolha e feita, mas a inconsistencia. Codigo inconsistente dificulta leitura, code review, e gera diffs desnecessarios no git.

## O "melhor dos mundos" segundo o instrutor

A sacada principal e: **automatizar a correcao**. Se uma pessoa digita aspas duplas mas o projeto usa simples, ao salvar o arquivo a conversao acontece automaticamente. Ninguem precisa pensar nisso. Ninguem precisa corrigir manualmente. A ferramenta resolve.

Isso elimina:
- Discussoes sobre estilo em code review
- Commits apenas para "fix lint"
- Atrito entre membros do time

## Preset vs configuracao manual

O instrutor usa `@rocketseat/eslint-config` que e um preset pronto. Os padroes especificos desse preset:
- Aspas simples
- Sem ponto e virgula
- Espacos (2 espacos para indentacao)

Ele deixa claro que voce nao precisa seguir esses padroes — pode criar os seus. O preset e apenas um ponto de partida que evita configurar dezenas de regras manualmente.

## A flag `--ext` vs `-e`

Durante a aula, o instrutor inicialmente usou `-e` para especificar extensoes e recebeu um erro. A flag correta e `--ext` (dois tracos). Esse e um erro comum porque muitas ferramentas CLI usam flags de uma letra, mas o ESLint usa `--ext` como flag longa sem equivalente curto para extensoes.

## Dois modos de uso do lint

1. **Deteccao** (`eslint src --ext .ts`): lista erros sem modificar nada. Ideal para CI/CD e para verificar o estado do codigo.

2. **Correcao** (`eslint src --ext .ts --fix`): corrige automaticamente o que for possivel. Ideal para rodar localmente apos instalar ESLint em projeto existente.

O instrutor enfatiza que o comando sem `--fix` e o que voce roda "no momento que alguem do time subir o codigo" — ou seja, como gate de qualidade. Mesmo que a pessoa nao tenha a extensao do VSCode instalada, o CI vai pegar os erros.

## Auto-fix on save no VSCode

A configuracao `editor.codeActionsOnSave` com `source.fixAll.eslint: true` faz o VSCode executar o ESLint fix toda vez que voce salva um arquivo. Isso e o mecanismo que torna a padronizacao "invisivel" — voce escreve do jeito que quiser e ao salvar o codigo se ajusta ao padrao do projeto.

Se o ESLint nao comecar a mostrar erros apos instalacao, o instrutor recomenda usar "Developer: Reload Window" no command palette do VSCode para forcar o recarregamento da extensao.