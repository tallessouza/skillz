# Deep Explanation: Self-hosted Infra para N8N

## Por que self-hosted?

O N8N oferece opcao cloud (hospedado por eles) e self-hosted. O self-hosted da controle total sobre dados, custos previsíveis e possibilidade de customizacao.

## A documentacao oficial como ponto de partida

O instrutor enfatiza: **sempre comece pela documentacao**. O GitHub do N8N contem toda a estrutura, licenciamento, exemplos de workflows e, crucialmente, a secao "hosting N8N" com server setups para multiplos provedores.

Importante: o layout da documentacao muda com frequencia. Nao se apegue a posicao dos links — busque por "hosting" ou "server setups".

## Por que Hostinger + EasyPanel?

### A historia do instrutor

O instrutor tinha um servidor na Hostinger com um painel mais tecnico instalado. O processo de instalacao de aplicacoes era: clicar opcao 1, opcao 2, instalar. Parecia simples ate comecar a dar problemas. Quando algo quebrava, resolver exigia entrar em linhas de comando, buscar logs, debugar — um processo descrito literalmente como "um parto".

A migracao para EasyPanel resolveu isso. O EasyPanel abstrai a complexidade operacional mantendo a flexibilidade de um VPS.

### A logica da escolha

- **Preco:** OK, nao e o mais barato do mercado, mas competitivo
- **Praticidade:** O fator decisivo — "a praticidade foi o que basicamente conquistou"
- **Estabilidade:** KVM2 descrito como "super estavel, nunca tive problema algum"
- **Escalabilidade:** Comeca barato, escala depois se precisar

## O que e uma VPS?

VPS = Virtual Private Server. E um servidor virtual privado onde voce pode instalar qualquer aplicacao. Diferente de hospedagem compartilhada, voce tem recursos dedicados (CPU, RAM, disco).

## O que e o EasyPanel?

EasyPanel e um painel de gerenciamento de aplicacoes para servidores. Ele permite instalar, configurar e gerenciar aplicacoes sem precisar usar linha de comando diretamente. Como o nome sugere: "easy panel" — painel facil.

### Vantagem sobre paineis tecnicos

O instrutor experimentou paineis mais tecnicos antes. A instalacao era facil, mas a **manutencao e resolucao de problemas** era o gargalo. EasyPanel resolve isso com interface visual para tudo.

## Fluxo completo pos-compra

1. Compra VPS → painel Hostinger mostra servidor
2. Dentro do servidor: metricas (CPU, memoria, atividade)
3. EasyPanel ja instalado → botao "Gerenciar painel"
4. Dentro do EasyPanel: instalar qualquer servico (N8N sera o proximo passo)

## Consideracoes sobre provedores alternativos

O instrutor deixa claro: "existem milhoes de empresas que fornecem servicos de hospedagem". A escolha depende de:
- Onde a empresa ja tem infra
- Requisitos de compliance/localizacao
- Orcamento disponivel
- Nivel de conhecimento tecnico da equipe

Provedores listados na doc oficial: DigitalOcean, Heroku, Hetzner, AWS, Azure, GCP. Muitos ja oferecem servidores com N8N pre-instalado.