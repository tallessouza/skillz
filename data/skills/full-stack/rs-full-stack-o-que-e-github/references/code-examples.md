# Code Examples: O Que É GitHub

## Fluxo Conceitual: Local → GitHub

Esta aula é conceitual e não apresenta código, mas o fluxo técnico que será implementado nas próximas aulas segue este padrão:

### 1. Criar repositório local (Git)

```bash
# Inicializar repositório Git na máquina
git init meu-projeto
cd meu-projeto

# Fazer alterações e commitar
git add .
git commit -m "primeiro commit"
```

### 2. Conectar com GitHub (o "linkar" que o instrutor menciona)

```bash
# Adicionar GitHub como remote
git remote add origin https://github.com/seu-usuario/meu-projeto.git

# Enviar código para o GitHub
git push -u origin main
```

### 3. Colaboração (outras pessoas acessando)

```bash
# Outra pessoa trazendo o projeto do GitHub para sua máquina
git clone https://github.com/seu-usuario/meu-projeto.git

# Trabalhando e enviando mudanças
git add .
git commit -m "minha contribuição"
git push
```

## Diagrama do Fluxo Completo

```
[Sua Máquina]          [GitHub (nuvem)]         [Máquina do Colega]
     │                       │                         │
     │── git push ──────────>│                         │
     │                       │<──── git clone ─────────│
     │                       │<──── git push ──────────│
     │<── git pull ──────────│                         │
     │                       │                         │
```

## Plataformas Mencionadas

| Plataforma | URL | Popularidade |
|-----------|-----|-------------|
| GitHub | github.com | Mais popular, padrão da indústria |
| GitLab | gitlab.com | Popular em empresas, CI/CD nativo |
| Bitbucket | bitbucket.org | Integração Atlassian |