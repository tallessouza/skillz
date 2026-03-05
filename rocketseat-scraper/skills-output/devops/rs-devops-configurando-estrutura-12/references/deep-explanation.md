# Deep Explanation: Semantic Release — Configuracao na Pipeline

## Por que versionamento automatizado importa

O instrutor enfatiza que o `package.json` sempre carrega a versao no formato **major.minor.patch**. A distincao critica:

- **Minor e Patch**: alteracoes simples que NAO geram breaking change para downstream (quem consome seu servico)
- **Major**: gera breaking change — consumidores precisam adaptar

Sem automacao, desenvolvedores esquecem de atualizar a versao, ou atualizam incorretamente. O versionamento semantico (semver) resolve isso ao derivar a versao da **mensagem do commit**.

## Como o Semantic Release decide a versao

O plugin `@semantic-release/commit-analyzer` le as mensagens de commit seguindo Conventional Commits:

- `fix:` → patch (1.0.0 → 1.0.1)
- `feat:` → minor (1.0.0 → 1.1.0)
- `feat!:` ou `BREAKING CHANGE:` → major (1.0.0 → 2.0.0)

## Por que o token precisa dessas permissoes especificas

O instrutor detalha que o Semantic Release precisa do token porque:

1. **Gera release** no GitHub (precisa write em contents)
2. **Escreve no CHANGELOG** e faz commit (precisa write em contents)
3. **Atualiza version no package.json** e pode fazer commit automatico
4. **Pode criar issues** em caso de falha (precisa write em issues)
5. **Le as actions** para verificar status (precisa read em actions)

O instrutor criou um token "bem escopado, bem tranquilo" — somente para o repositorio especifico, com apenas 4 permissoes.

## Fluxo de configuracao do token

1. GitHub > Settings (conta pessoal) > Developer Settings
2. Personal Access Tokens > Fine-grained tokens
3. Escopo: repositorio especifico
4. Permissoes: Actions (read), Contents (read/write), Issues (read/write)
5. Copiar token gerado
6. Repositorio > Settings > Secrets and variables > Actions
7. Criar secret `GH_TOKEN` com o valor do token

## Papel de cada plugin

- **commit-analyzer**: analisa mensagens de commit para determinar o tipo de release
- **release-notes-generator**: gera as notas de release automaticamente
- **changelog**: atualiza o arquivo CHANGELOG.md no repositorio
- **git**: faz commit das mudancas (changelog, package.json) de volta ao repo
- **github**: cria a GitHub Release com as notas geradas

## Decisao de design: branches

O `.releaserc` aceita uma lista de branches, mas o instrutor recomenda apenas `["main"]` — releases so devem sair da branch principal. Isso evita releases acidentais de branches de feature.

## Posicionamento na pipeline

O step de semantic release deve vir **antes** de qualquer step de "generate tag" manual. Isso porque o semantic release ja cria as tags automaticamente baseado na analise dos commits.