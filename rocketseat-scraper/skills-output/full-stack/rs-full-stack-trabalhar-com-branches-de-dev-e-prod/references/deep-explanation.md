# Deep Explanation: Branches de Dev e Prod com Vercel

## Por que nunca mandar direto para main?

O instrutor Rodrigo enfatiza um conceito central: a branch `main` e o espelho direto da producao. Dentro da Vercel, o comportamento e automatico — toda vez que main recebe um novo push, uma nova build e gerada e imediatamente se torna a versao rodando em producao (marcada com tag "Current").

Isso significa que qualquer erro, qualquer detalhe nao percebido, vai impactar diretamente todos os usuarios que estao usando a aplicacao. Nao ha etapa intermediaria de validacao.

## O conceito de dois ambientes

O instrutor apresenta dois ambientes fundamentais:

1. **Ambiente de Dev (desenvolvimento):** sua maquina local, rodando em localhost. Aqui voce desenvolve, testa, experimenta. Nenhum usuario final e afetado.

2. **Ambiente de Prod (producao):** onde os usuarios reais usam a aplicacao. Qualquer alteracao aqui tem impacto real.

O problema surge quando o fluxo e: dev → commit → main → producao, sem nenhuma etapa intermediaria.

## A solucao: branch secundaria + preview

A Vercel oferece uma funcionalidade poderosa: para qualquer branch que nao seja a principal, ela gera automaticamente uma URL de pre-visualizacao (preview). Esse ambiente de preview:

- E praticamente identico ao ambiente de producao
- Usa as mesmas configuracoes de build
- Gera uma URL unica acessivel por qualquer pessoa com o link
- **Nao** afeta os usuarios finais — so quem tem o link pode ver

Isso cria uma etapa intermediaria segura:

```
Dev local → Branch secundaria → Preview (ambiente simulado de prod) → Validacao → Merge para main → Producao
```

## Analogia do instrutor

O instrutor usa a analogia de "simular" o ambiente de producao. O preview nao e um ambiente de testes tradicional — e um ambiente que roda exatamente como producao rodaria, mas em isolamento. E como um ensaio geral antes da estreia.

## Fluxo de correcao seguro

Se durante o teste no preview voce identifica um problema:

1. O problema **nao** afeta producao (esta isolado na branch secundaria)
2. Voce corrige localmente
3. Faz novo commit na mesma branch secundaria
4. A Vercel gera automaticamente um novo preview
5. Voce testa novamente
6. So faz merge para main quando tudo estiver validado

Esse ciclo pode se repetir quantas vezes for necessario, sem nunca impactar producao.

## Quando o merge acontece

O merge para main so deve acontecer apos:
- Testar a funcionalidade no preview
- Validar que nao ha erros visuais ou funcionais
- Confirmar que o comportamento esta correto

Apos o merge, a Vercel detecta automaticamente a atualizacao em main e gera a build de producao. Esse deploy aparece na aba Deployments com a tag "Current".

## Beneficio principal

O instrutor resume: "voce tem uma etapa intermediaria para simular isso que voce acabou de fazer, seja uma nova funcionalidade, uma correcao e assim por diante." A seguranca vem de nunca pular essa etapa.