# Deep Explanation: Grupos de Atualizações

## Por que agrupar atualizações?

O instrutor destaca que atualizar dependências sem critério é arriscado. A abordagem manual — olhar `npm outdated` e tentar identificar quais mudanças são breaking — funciona, mas é trabalhosa. O agrupamento automático por tipo semântico resolve isso de forma visual e interativa.

## Versionamento Semântico como critério de risco

O agrupamento do `npm-check-updates` com `--format group` usa o versionamento semântico (semver) como base:

- **Patch (x.x.MUDOU):** O último número mudou. São correções de bugs. Compatíveis com a versão atual. Risco muito baixo de quebrar algo.
- **Minor (x.MUDOU.x):** O número do meio mudou. Traz novas funcionalidades, mas mantém compatibilidade com a API existente. Risco baixo a médio.
- **Major (MUDOU.x.x):** O primeiro número mudou. Pode conter breaking changes — a API pode ter mudado, funcionalidades podem ter sido removidas. Risco alto.

## Complementaridade entre ferramentas

O instrutor enfatiza que `npm outdated` e `npx npm-check-updates` mostram informações diferentes:

- `npm outdated` mostra a versão atual, a versão "wanted" (respeitando o range do package.json) e a "latest"
- `npx npm-check-updates` pula direto para a versão mais recente, sem mostrar intermediárias

Por isso a recomendação é usar as duas ferramentas juntas para ter uma visão mais completa antes de decidir.

## Caso real: tipagens com major bump

No projeto do curso, as tipagens `@types/express` e `@types/node` apareceram no grupo "major". Isso demonstra que até pacotes de tipagem podem trazer breaking changes — a interface dos tipos pode mudar, quebrando código que dependia de uma assinatura específica.

## Estratégia de atualização recomendada

1. Analise com ambas ferramentas (`npm outdated` + `npx npm-check-updates`)
2. Use modo interativo com agrupamento para visualizar riscos
3. Atualize patches primeiro (mais seguro)
4. Depois minors (novas funcionalidades, compatíveis)
5. Avalie majors individualmente (potencial breaking change)
6. Teste após cada grupo de atualização

## Por que não atualizar tudo de uma vez

Se você atualiza 10 pacotes simultaneamente e algo quebra, é difícil identificar qual pacote causou o problema. Atualizando por grupo (primeiro patches, depois minors, depois majors), você isola a causa de possíveis problemas mais facilmente.