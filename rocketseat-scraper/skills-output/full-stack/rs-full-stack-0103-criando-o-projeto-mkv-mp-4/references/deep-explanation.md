# Deep Explanation: Criando Projeto Express + TypeScript

## Por que separar dependencias de producao e desenvolvimento?

O instrutor Rodrigo Goncalves demonstra um erro comum: instalar `@types/express` sem a flag `-D`, fazendo com que a tipagem va para `dependencies` em vez de `devDependencies`. Tipagens so sao necessarias em tempo de desenvolvimento — em producao, o codigo ja esta compilado para JavaScript e nao precisa de tipos.

A correcao e simples: reinstalar com `-D` (maiusculo). O npm automaticamente move o pacote de `dependencies` para `devDependencies`. Essa e uma dica pratica que evita retrabalho.

### Regra geral de separacao

- **dependencies**: pacotes que o servidor precisa em producao para funcionar (Express, Prisma, etc.)
- **devDependencies**: pacotes usados apenas no desenvolvimento (TypeScript, tipagens, bundlers, test runners)

## Por que fixar versoes?

O instrutor recomenda explicitamente instalar as mesmas versoes que ele usa no curso. Isso evita problemas de incompatibilidade conforme as aulas avancam. Bibliotecas podem ter breaking changes entre minor/patch versions, especialmente em ecossistemas ativos como TypeScript e Express.

### Versoes usadas neste projeto

| Pacote | Versao | Tipo |
|--------|--------|------|
| express | 4.19.2 | producao |
| @types/express | 5.0.0 | desenvolvimento |
| typescript | 5.7.3 | desenvolvimento |
| tsx | 4.19.2 | desenvolvimento |
| ts-node | 10.9.2 | desenvolvimento |

## TypeScript no Node.js — estado atual

O instrutor menciona que o Node.js esta trazendo suporte nativo a TypeScript, mas que no momento da gravacao ainda estava experimental. Por isso, ele opta por usar as bibliotecas tradicionais:

- **typescript**: compilador TypeScript
- **tsx**: executor de TypeScript com hot reload (alternativa moderna ao ts-node para desenvolvimento)
- **ts-node**: executor de TypeScript no Node.js (mais estabelecido)

Ter ambos (`tsx` e `ts-node`) da flexibilidade — `tsx` e mais rapido para desenvolvimento, enquanto `ts-node` e mais maduro para configuracoes especificas.

## Fluxo de trabalho do instrutor

1. Criar pasta do projeto com nome descritivo (`refund_api`)
2. Navegar via terminal arrastando a pasta para obter o caminho completo
3. `npm init -y` para gerar package.json padrao
4. Abrir no VS Code arrastando a pasta
5. Limpar package.json (remover keywords vazio, adicionar author e description)
6. Instalar dependencias em ordem: producao primeiro, depois desenvolvimento
7. Verificar que tudo esta no lugar correto no package.json

## Dica do instrutor: arrastar pasta para o terminal

Em vez de digitar o caminho completo, o instrutor arrasta a pasta do explorador de arquivos para o terminal. O sistema operacional automaticamente insere o caminho absoluto. Isso e mais rapido e evita erros de digitacao em caminhos longos.