# Deep Explanation: Rodando Pipeline CI/CD

## Trunk-Based Development na pratica

O instrutor demonstra um fluxo proximo ao trunk-based development: branches curtas criadas diretamente da `main`, com merge rapido. A ideia e que a branch viva pouco tempo — o suficiente para o PR ser revisado e mergeado.

### Convencao de nomenclatura de branches

O instrutor segue: `{tipo}/{descricao-breve}` — exemplos:
- `feature/configure-release`
- `fix/content-repository-permission`

Ele menciona que gosta de incluir tambem quem esta fazendo, para controle. O tipo (`feature`, `fix`) indica a intencao, a descricao e breve, e opcionalmente identifica o autor.

## Por que o workflow nao dispara na feature branch

O workflow esta configurado com trigger `on: push: branches: [main]`. Qualquer push em outra branch e ignorado. Isso e intencional — o pipeline de deploy so roda apos merge na main.

## O ciclo iterativo de permissoes

O instrutor demonstra um padrao real e comum: configurar pipeline, rodar, falhar por permissao, corrigir, rodar de novo. Isso acontece porque:

1. GitHub Actions tem permissoes granulares por recurso
2. O default e restritivo (`read`)
3. Semantic-release precisa de `write` em `contents` para criar commits (changelog), tags e releases

### A permissao `contents`

No YAML do workflow, a secao `permissions` controla o que o token `GITHUB_TOKEN` pode fazer:

```yaml
permissions:
  contents: write  # commits, branches, downloads, releases
```

Sem `write`, o semantic-release consegue analisar commits e calcular a versao, mas falha ao tentar:
- Fazer push do changelog commitado
- Criar a tag
- Criar a release

### Issue automatica

O instrutor mostra que o semantic-release abriu automaticamente uma issue no repositorio quando falhou. Isso e um recurso do semantic-release para facilitar debugging — a issue contem documentacao do que deu errado.

## Semantic-release: o que ele faz no pipeline

1. Analisa commits desde a ultima release (convencional commits)
2. Determina o tipo de bump: major, minor ou patch
3. Gera changelog automatico
4. Cria commit com changelog atualizado
5. Cria tag git com a nova versao
6. Cria release no GitHub com o pacote

O instrutor destaca que o semantic-release roda ANTES do generate tag no pipeline — e uma etapa configurativa, nao de deploy.

## Problema residual: permissao para recurso especifico

Mesmo apos corrigir `contents: write`, o instrutor ainda encontrou erro de permissao. O changelog foi gerado, a release foi parcialmente criada, mas algo ainda faltou. Ele menciona que precisa investigar "qual recurso" nao tem permissao — possivelmente `issues: write` ou `pull-requests: write` para que o semantic-release possa interagir completamente.

## Boas praticas observadas

1. **Deletar branch apos merge** — manter repositorio limpo. Pode ser automatizado nas settings do GitHub
2. **Nao commitar direto na main** — sempre via PR, mesmo sem revisores
3. **Investigar antes de forcar** — o instrutor nao forca permissoes amplas, vai corrigindo granularmente
4. **Actions em PRs (mencionado)** — coverage, code smells, linhas duplicadas via SonarQube/SonarCloud