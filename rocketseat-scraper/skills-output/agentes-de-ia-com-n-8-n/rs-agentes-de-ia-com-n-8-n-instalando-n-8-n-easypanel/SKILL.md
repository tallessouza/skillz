---
name: rs-agentes-ia-n8n-instalando-n8n-easypanel
description: "Guides N8N installation on Easypanel for self-hosted setup. Use when user asks to 'install n8n', 'setup n8n on easypanel', 'self-host n8n', 'deploy n8n', or 'configure n8n server'. Covers project creation, service deployment, account activation, and troubleshooting activation key errors. Make sure to use this skill whenever setting up N8N infrastructure on Easypanel. Not for n8n workflow creation, node configuration, or agent building inside n8n."
---

# Instalando N8N no Easypanel

> Instale o N8N self-hosted no Easypanel em minutos para ter workflows e agentes de IA ilimitados.

## Prerequisites

- Easypanel instalado e acessivel via painel web
- Acesso a um email valido para receber o codigo de ativacao
- DNS configuravel (opcional, para dominio customizado)

## Steps

### Step 1: Criar projeto no Easypanel

1. Acessar o painel do Easypanel
2. Clicar em **Criar Projeto**
3. Definir o nome do projeto (ex: `n8n-production`)

### Step 2: Adicionar servico N8N

1. Dentro do projeto, ir em **Servicos**
2. Buscar por `n8n` na lista de servicos disponiveis
3. Clicar no servico N8N
4. Manter nome e imagem padrao
5. Clicar em **Criar**
6. Aguardar o deploy finalizar (geralmente < 2 minutos)

### Step 3: Acessar o N8N

1. Ir em **Ambiente** no menu do servico
2. Copiar a URL gerada automaticamente pelo Easypanel
3. Abrir a URL no navegador

### Step 4: Criar conta inicial

1. Preencher email e senha na tela de setup
2. Preencher dados da empresa (pesquisa opcional, pode ser qualquer valor)
3. Clicar em **Get Started**

### Step 5: Ativar o plano Community Edition

1. Aguardar email com codigo de ativacao (ate 2 minutos)
2. Copiar o codigo de ativacao do email
3. Colar no campo de ativacao do N8N
4. Confirmar ativacao

## Output format

N8N self-hosted acessivel via URL do Easypanel, com plano Community Edition ativado e workflows ilimitados.

## Error handling

- Se a senha nao for aceita no cadastro: verificar se o preenchimento automatico do navegador nao inseriu caracteres invalidos. Digitar manualmente.
- Se `Activation key has already been used on this instance`: a chave ja foi usada nesta instancia. Isso ocorre quando ja existe outro N8N ativo com a mesma chave. Para instalacoes novas, esse erro nao ocorre.
- Se o deploy demorar: verificar logs do servico no painel do Easypanel.

## Verification

- Acessar a URL e ver a interface do N8N carregada
- Verificar em **Settings** que o plano mostra "Community Edition" com workflows ilimitados
- Criar um workflow vazio de teste para confirmar funcionamento

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
