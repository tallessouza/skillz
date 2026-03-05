# Deep Explanation: Otimizacao de Imagens Docker

## Por que copiar o lock file?

O instrutor destaca que copiar apenas o `package.json` sem o lock file faz com que o gerenciador de pacotes resolva versoes novamente a cada build. O lock file garante reprodutibilidade — a mesma arvore de dependencias em qualquer ambiente.

No caso do **npm**, o asterisco `package*.json` resolve porque o lock se chama `package-lock.json`. No **yarn**, o lock se chama `yarn.lock`, entao precisa ser copiado explicitamente.

## Yarn Berry (v3) — configs extras obrigatorias

Quando o projeto usa yarn v3 (definido em `packageManager` no package.json), existem arquivos adicionais necessarios:
- `yarnrc.yml` — configuracao do yarn, inclui `yarnPath` apontando para o release
- `.yarn/releases/` — binario do yarn v3 (ex: `yarn-3.4.1.cjs`)

Sem esses arquivos, o `yarn install` dentro do container falha. O instrutor demonstrou isso ao vivo: adicionou `.yarn` ao .dockerignore e o build quebrou com "not found".

**Licao importante:** antes de ignorar algo no .dockerignore, verifique se o build process precisa daquele arquivo.

## Separacao de COPY: arquivos vs pastas

O instrutor enfatiza como boa pratica:
- Arquivos podem ser agrupados num unico COPY
- Pastas devem ter COPY individual, referenciando o destino explicitamente: `COPY .yarn ./.yarn`
- Se tiver varias pastas, criar varias linhas de COPY

Isso evita ambiguidade na resolucao de paths e torna o Dockerfile mais legivel.

## .dockerignore — analogia com .gitignore

O instrutor faz a analogia direta: assim como `.gitignore` evita commitar arquivos desnecessarios, `.dockerignore` evita copiar arquivos desnecessarios para o contexto de build.

Itens que devem ser ignorados:
- `node_modules` — sera reinstalado pelo `yarn install`
- `dist` — sera recriado pelo `yarn build`
- `.git` — historico git nao tem funcao no container
- `Dockerfile` — arquivo configurativo, nao faz parte da aplicacao
- `.dockerignore` — o proprio arquivo de ignore

O instrutor destaca que so deve ser copiado o que e "de fato necessario": source code, tests, e arquivos de configuracao cruciais.

## Impacto real nas metricas

O instrutor demonstrou a progressao:
1. **Inicial:** ~1GB
2. **Apos copiar lock files:** ~805MB (reducao de ~200MB, ganho de performance)
3. **Apos .dockerignore:** ~500MB (metade do tamanho original)

Alem do tamanho, o tempo de build caiu de forma significativa — de minutos para ~6 segundos na segunda execucao (com ajuda do cache de layers).

## Tagging — por que nao usar latest

O instrutor explica que `latest` e a tag padrao quando nenhuma e especificada. O problema:
- Sempre sobrescreve a versao anterior
- Nao mantem historico
- Impossibilita rollback
- Nao tem "lastro" (rastreabilidade)

A boa pratica e versionar: `api:v1`, `api:v2`. Em CI/CD, essas tags sao geradas automaticamente (git SHA, semver). Por ora no curso, sao passadas manualmente.

O comando `docker image history` permite verificar o historico de layers de cada versao, util para comparar tamanhos entre versoes.