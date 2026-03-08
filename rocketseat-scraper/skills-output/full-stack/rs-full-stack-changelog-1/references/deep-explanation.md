# Deep Explanation: Changelog

## Por que changelogs importam tanto

O instrutor enfatiza que saber da **existência** de changelogs já é o primeiro passo. Muitos desenvolvedores iniciantes atualizam dependências cegamente — mudam o número no `package.json` e torcem para nada quebrar. O changelog é a ferramenta que elimina essa incerteza.

### A analogia do relatório médico

Pense no changelog como um relatório médico de uma biblioteca. Assim como você não toma um remédio novo sem ler a bula, não deveria atualizar uma dependência sem ler o que mudou. O changelog é a "bula" da versão.

## O ciclo natural de releases

O instrutor mostrou que no Express, duas versões foram lançadas com diferença de apenas um dia. Isso ilustra um padrão importante do open source:

1. **Versão é lançada** — testada internamente, mas com cobertura limitada de cenários
2. **Comunidade adota** — milhares de projetos diferentes expõem a versão a cenários nunca previstos
3. **Bugs aparecem** — cenários de borda que não existiam nos testes internos
4. **Patch é lançado rapidamente** — correção vem no dia seguinte

Isso não é sinal de má qualidade — é o fluxo natural de software open source com adoção massiva.

## Formatos de changelog variam muito

O instrutor mostrou três formatos diferentes:

### Express — Tópicos objetivos
- Lista de mudanças por versão
- Data de lançamento
- Formato direto e sucinto
- Disponível na documentação oficial

### React — GitHub Releases
- Changelogs publicadas como GitHub Releases
- Guias de upgrade linkados
- Formato mais técnico

### React Native — Blog/Artigo
- Formato de artigo completo
- Highlights e destaques da versão
- Benchmarks e comparações de performance
- Breaking changes detalhadas com contexto
- Guia de atualização integrado no artigo

### Lição: não existe padrão único
Cada time de desenvolvimento escolhe como documentar mudanças. O importante é:
- Saber que changelog existe
- Saber onde procurar (site oficial, GitHub, NPM → repositório)
- Entender o que cada seção significa

## Breaking changes — o conceito mais importante

O instrutor destaca repetidamente as **breaking changes** (mudanças que quebram compatibilidade). Uma breaking change significa que código que funcionava na versão anterior pode não funcionar na nova.

### Quando esperar breaking changes:
- **Mudança de major version** (ex: Express 4 → Express 5) — quase certeza de breaking changes
- **Presença de guia de migração** — se a biblioteca oferece guia, é porque há incompatibilidades
- **Palavras-chave no changelog**: "breaking", "deprecated", "removed", "renamed"

### O que fazer quando encontrar breaking changes:
1. Ler o guia de migração completo antes de começar
2. Avaliar o impacto no seu projeto específico
3. Planejar a migração (pode não ser trivial)
4. Considerar se a atualização é realmente necessária agora

## Contribuição open source via Issues

O instrutor destaca que contribuir com open source não é apenas escrever código. Abrir uma issue bem escrita já é uma contribuição valiosa:

- **Bug report**: detalhar o problema, passos para reproduzir, comportamento esperado vs real
- **Documentação**: apontar erros ou lacunas na documentação
- **Perguntas**: esclarecer comportamentos ambíguos
- **Vulnerabilidades**: reportar falhas de segurança (geralmente tem canal específico)

O instrutor enfatiza: "essa é a essência do open source" — a comunidade encontra problemas, reporta, e às vezes isso se transforma em correções que beneficiam todos.

## Edge cases e situações reais

### Changelog não disponível ainda
O instrutor mostrou que o Express 5 tinha um link para guia de migração que ainda não estava disponível. Isso acontece — bibliotecas lançam versões antes da documentação estar 100% pronta. Nesses casos, é prudente esperar.

### Atualizações de segurança urgentes
Às vezes um patch de segurança é lançado e você precisa atualizar rapidamente. Mesmo nesses casos, consulte o changelog — patches de segurança geralmente são bem documentados e focados.

### Múltiplas versões de diferença
Se seu projeto está na versão 3.x e a atual é 5.x, você precisa ler changelogs de todas as major versions intermediárias. Cada uma pode ter breaking changes que se acumulam.