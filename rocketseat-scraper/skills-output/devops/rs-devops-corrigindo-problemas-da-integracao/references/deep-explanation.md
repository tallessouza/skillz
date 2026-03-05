# Deep Explanation: Corrigindo Problemas de Integracao com Semantic Release

## Por que tres camadas de permissao?

O GitHub Actions tem um modelo de permissao em camadas. Quando o Semantic Release roda dentro de um workflow, ele precisa de autorizacao em tres niveis independentes:

1. **CI Workflow YAML (`permissions:`)** — define o que o job pode fazer dentro do runner. Mesmo que o token tenha permissao total, se o workflow YAML nao declara `issues: write`, o job nao consegue escrever em issues.

2. **Repository Settings (Workflow permissions)** — e uma configuracao global do repositorio que limita o que qualquer workflow pode fazer. Se estiver em "Read only", nenhum workflow consegue escrever, independente do que o YAML declare.

3. **Personal Access Token (PAT)** — o Semantic Release usa o token para autenticar chamadas a API do GitHub. O token precisa ter scopes compativeis com o que a lib tenta fazer.

## O papel da lib `@semantic-release/github`

O instrutor explica que o erro vem especificamente da lib `@semantic-release/github`, que e um plugin do Semantic Release. Esta lib:

- Busca issues abertas para correlacionar com a release
- Busca pull requests para associar ao changelog
- Potencialmente comenta em issues/PRs para notificar sobre a release
- Cria a release no GitHub com tag e notas

Por isso precisa de `write` e nao apenas `read` — a lib nao so le, ela potencialmente escreve.

## Por que rerun nao gera release

O Semantic Release e **orientado pelo arquivo `.releaserc`** e pelo historico de commits. Quando voce faz rerun de um job, nao ha commits novos desde a ultima tag publicada. O Semantic Release detecta isso e reporta: "the local branch has nothing to be published".

Para testar de verdade, o fluxo completo e:
1. Fazer uma alteracao (qualquer uma)
2. Commit com mensagem semantica (ex: `fix: ...`)
3. Push para branch
4. Abrir PR
5. Fazer merge na main
6. O workflow roda e gera release automaticamente

## O que a release gera

Quando tudo funciona, o Semantic Release gera um "pacote completo":
- Nova tag (ex: `v1.0.6`)
- Nova release no GitHub
- Changelog atualizado automaticamente
- Versionamento controlado pelo tipo de commit (fix = patch, feat = minor, breaking change = major)

## Dica do instrutor sobre breaking changes

O instrutor menciona que dependendo do comentario do commit, o Semantic Release mudaria para v2 (major version). Isso acontece quando o commit contem `BREAKING CHANGE:` no footer ou usa `!` apos o tipo (ex: `feat!: ...`). Isso e fundamental para controle de versionamento semantico.