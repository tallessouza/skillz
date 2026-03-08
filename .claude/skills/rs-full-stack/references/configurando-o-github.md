---
name: rs-full-stack-configurando-o-github
description: "Configures GitHub profile settings when user asks to 'setup GitHub', 'configure GitHub profile', 'create GitHub account', or 'prepare GitHub for work'. Applies recommended profile fields: username, bio, company, location, website, social links, and profile photo. Make sure to use this skill whenever setting up a new GitHub profile or reviewing an incomplete one. Not for Git CLI configuration, SSH keys, or repository settings."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [github, profile, setup, configuration]
---

# Configurando o Perfil do GitHub

> Configure o perfil publico do GitHub com todas as informacoes minimas recomendadas para que outros desenvolvedores possam te conhecer.

## Prerequisites

- Conta no GitHub criada
- Foto de perfil preparada (maximo 1MB)

## Steps

### Step 1: Acessar configuracoes de perfil

Navegar ate o icone do usuario no canto superior direito e selecionar "Your profile", depois clicar em "Edit profile".

### Step 2: Preencher informacoes basicas

| Campo | Acao | Exemplo |
|-------|------|---------|
| **Name** | Nome completo ou nome profissional | `Mike Brito` |
| **Bio** | Frase curta sobre voce | `Desenvolvedor Full Stack` |
| **Company** | Empresa atual (opcional) | `@skillz` |
| **Location** | Minimo: pais | `Brasil` |
| **Website** | Site pessoal ou portfolio | `https://meusite.dev` |

### Step 3: Adicionar redes sociais

Adicionar links de redes sociais disponiveis — LinkedIn e prioridade, porque conecta o perfil tecnico ao profissional. Adicionar todas as redes que tiver.

### Step 4: Upload da foto de perfil

Clicar em "Edit" na foto de perfil e fazer upload. A foto deve ter no maximo 1MB. Ajustar o enquadramento e salvar.

### Step 5: Salvar

Clicar em "Save" para aplicar todas as alteracoes.

## Output format

Perfil publico do GitHub com: nome, bio, localizacao, pelo menos uma rede social, e foto de perfil.

## Verification

- Acessar o perfil publico (`github.com/{username}`) e verificar se todas as informacoes aparecem
- Confirmar que a foto carregou corretamente
- Verificar se os links de redes sociais funcionam

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao trabalha em empresa | Deixe o campo Company vazio, sem problema |
| Nao tem site | Pule o campo Website |
| Foto maior que 1MB | Redimensione antes do upload |
| Perfil em ingles | Mude o idioma nas settings se preferir, mas o conteudo pode ser em portugues |


## Code example

```bash
# Verificar configuracao do git que conecta ao GitHub
git config --global user.name   # Deve bater com o nome no GitHub
git config --global user.email  # Deve bater com o email do GitHub
```

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Foto de perfil nao carrega | Arquivo maior que 1MB | Redimensione a imagem para menos de 1MB antes do upload |
| Links de redes sociais nao funcionam | URL incompleta ou incorreta | Use URL completa com https:// no inicio |
| Perfil aparece vazio para outros usuarios | Alteracoes nao salvas | Clique em Save apos preencher todos os campos |
| Contribuicoes nao aparecem no perfil | Email do git config diferente do GitHub | Configure `git config --global user.email` com o email da conta GitHub |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que cada campo importa
- [code-examples.md](references/code-examples.md) — Exemplos de bios e configuracoes de perfil