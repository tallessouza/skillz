# Deep Explanation: ESLint, Prettier e Lefthook

## Por que Lefthook e nao Husky?

O instrutor escolhe Lefthook por ser "bem performatico". Lefthook eh escrito em Go, enquanto Husky depende de Node.js para executar. Em projetos grandes com muitos hooks, a diferenca de performance eh perceptivel. Alem disso, Lefthook tem suporte nativo a `{staged_files}`, parallelismo de comandos, e configuracao declarativa em YAML.

## A filosofia do pre-commit rapido

O ponto mais importante da aula eh a estrategia de separacao entre pre-commit e pre-push:

- **Pre-commit = velocidade** — O dev comita dezenas de vezes por dia. Se cada commit demora 30 segundos, o time vai comecar a usar `git commit --no-verify` e o hook perde todo o valor. Por isso, apenas formatacao (Prettier) deve rodar aqui.

- **Pre-push = rigor** — O push acontece poucas vezes por dia. Aqui vale rodar typecheck, lint e testes completos. Se algo falhar, o dev precisa corrigir antes de abrir PR. Isso garante que so sobe codigo testado e tipado.

O instrutor destaca: "Se a cada commit comecar a demorar, provavelmente o pessoal do seu time vai acabar esquipando isso e nao eh legal."

## Por que ESLint nao precisa ser instalado

Quando voce cria um projeto Next.js com `create-next-app`, o ESLint ja vem configurado com `eslint-config-next`. O que falta eh apenas a integracao com Prettier:

- `eslint-config-prettier` — desativa regras do ESLint que conflitam com Prettier
- `eslint-plugin-prettier` — roda Prettier como regra do ESLint

## O papel do .vscode/settings.json

Sem essa configuracao, o desenvolvedor precisa manualmente formatar o codigo. Com `formatOnSave: true` e o Prettier como formatter padrao, cada Ctrl+S ja aplica as regras. Isso cria uma "dupla verificacao" — o dev ve o resultado imediato ao salvar, e o hook garante no commit.

O instrutor demonstra isso ao vivo: sem o settings.json, salvar o arquivo nao muda nada. Depois de criar, o arquivo eh formatado automaticamente ao salvar.

## .prettierignore

O instrutor configura um `.prettierignore` para evitar que o Prettier tente formatar:
- `.vscode/` — configuracoes do editor
- Arquivos de sistema (`.DS_Store` no macOS)
- `.env` — variaveis de ambiente
- `node_modules/` (ja ignorado por padrao)
- Arquivos de lock (`package-lock.json`, etc.)

## stage_fixed: true

No Lefthook, a opcao `stage_fixed: true` re-adiciona ao staging os arquivos que foram modificados pelo Prettier durante o hook. Sem isso, o commit incluiria a versao nao-formatada e as mudancas do Prettier ficariam como unstaged changes.

## Fluxo completo de um commit

1. Dev executa `git commit -m "feat: algo"`
2. Lefthook intercepta (pre-commit)
3. Prettier formata os arquivos staged
4. `stage_fixed: true` re-adiciona os arquivos formatados
5. Commit eh finalizado com codigo formatado

## Fluxo completo de um push

1. Dev executa `git push`
2. Lefthook intercepta (pre-push)
3. `tsc --noEmit --skipLibCheck` verifica tipagem
4. `npm run lint` verifica regras ESLint
5. `npm test` roda os testes
6. Se QUALQUER um falhar, o push eh bloqueado
7. Dev corrige e tenta novamente