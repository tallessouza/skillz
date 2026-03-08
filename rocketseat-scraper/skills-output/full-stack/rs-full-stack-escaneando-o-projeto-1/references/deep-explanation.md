# Deep Explanation: Escaneando Dependências do Projeto

## Por que escanear antes de atualizar

O instinto natural é rodar `npm update` ou `npm install package@latest` e torcer para funcionar. O problema é que dependências em projetos reais têm interdependências complexas. Uma atualização que muda a major version pode quebrar a API que seu código usa — isso é o que chamamos de **breaking change**.

O `npm outdated` é a ferramenta de diagnóstico. Ele não muda nada no projeto — apenas mostra o estado atual vs o que está disponível.

## As três colunas explicadas

### Current (versão atual)
É exatamente o que está no `package.json` do projeto. Pode ser verificado abrindo o arquivo:

```json
{
  "dependencies": {
    "@prisma/client": "5.19.1"
  }
}
```

Se o `npm outdated` mostra `5.19.1` na coluna Current, é porque o `package.json` tem essa versão.

### Wanted (versão recomendada)
Esta é a versão mais recente que **respeita o range definido no package.json**. Se o `package.json` tem `"^5.19.1"`, o caret (`^`) permite atualizações de minor e patch dentro da mesma major. Então o npm recomenda `5.22.0` — mesma major (5), minor mais alta disponível.

O npm **nunca** recomenda uma versão que quebre o range semântico configurado. É por isso que `@types/node` com `"^20.14.12"` tem Wanted `20.17.6` e não `22.9.0`.

### Latest (última disponível)
É a versão com a tag `latest` no registry do npm. Não tem relação com compatibilidade — é simplesmente a mais nova publicada.

## Versionamento semântico na prática

O formato é `MAJOR.MINOR.PATCH`:

- **MAJOR** (ex: 4 → 5 no Express): pode ter breaking changes. APIs removidas, comportamentos alterados, assinaturas de função mudadas.
- **MINOR** (ex: 5.19 → 5.22 no Prisma): novas features, backward-compatible.
- **PATCH** (ex: 20.14.12 → 20.14.15): bug fixes apenas.

Quando a coluna Latest mostra uma major diferente da Current, é sinal de alerta. Não significa que você não pode atualizar — significa que precisa analisar.

## A estratégia do instrutor: "duas fases"

A abordagem ensinada é pragmática:

1. **Primeiro, resolva o fácil:** atualize tudo que o npm recomenda (Wanted). Isso já resolve a maioria das dependências e não vai quebrar nada, porque respeita o range semântico.

2. **Depois, com calma, ataque o difícil:** para cada dependência que tem breaking change disponível, analise individualmente. Leia o changelog, verifique o migration guide, atualize, teste, refatore se necessário.

Essa abordagem reduz a lista de pendências rapidamente (ganho psicológico e prático) e isola o risco nas dependências que realmente precisam de atenção.

## Quando Wanted == Current mas Latest é diferente

Isso acontece quando a versão atual já é a mais recente dentro do range permitido. Exemplo:

```
express  4.21.0  4.21.0  5.0.1
```

O Express está na 4.21.0, que é a última da major 4. O `package.json` tem `"^4.x.x"`, então o npm não recomenda a 5.0.1 automaticamente. Para migrar para o Express 5, precisa de atualização manual explícita.

## Analogia do instrutor

O processo é como uma revisão médica: primeiro você faz o check-up geral (`npm outdated`), identifica o que precisa de atenção, resolve os itens simples primeiro (exames de rotina), e depois agenda os procedimentos mais complexos (cirurgias) com planejamento adequado. Você não opera tudo de uma vez.

## Edge cases

### Dependências de desenvolvimento vs produção
O `npm outdated` mostra todas as dependências (dependencies + devDependencies). Dependências de desenvolvimento (@types, jest, tsx, tsup, typescript) geralmente são mais seguras de atualizar mesmo com major bumps, porque não afetam o runtime da aplicação.

### Peer dependencies
Se um pacote tem peer dependencies, atualizar ele pode causar conflitos com outros pacotes. O `npm outdated` não mostra isso diretamente — use `npm ls` para ver a árvore de dependências se encontrar problemas.

### Monorepos
Em monorepos, cada workspace tem seu próprio conjunto de dependências. Rode `npm outdated` em cada workspace ou na raiz com `--workspaces`.