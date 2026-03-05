# Code Examples: Publicando Projeto no GitHub Pages

## Criando repositorio via CLI

### Repositorio publico (recomendado)
```bash
# Inicializar git se ainda nao foi feito
git init
git add .
git commit -m "feat: projeto portal de noticias"

# Criar e fazer push
gh repo create "full-stack-projeto-portal-de-noticias" --public --source=. --push
```

### Mudando de privado para publico
```bash
# Via CLI
gh repo edit --visibility public
```

## Habilitando GitHub Pages

### Via CLI
```bash
# Habilitar Pages na branch main, pasta raiz
gh api repos/{owner}/{repo}/pages \
  -X POST \
  -f "build_type=legacy" \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

### Via interface web
1. Ir em Settings do repositorio
2. Menu lateral: Pages
3. Em "Source", selecionar branch `main`
4. Pasta: `/ (root)`
5. Clicar Save

## Configurando o About do repositorio

### Via CLI
```bash
gh repo edit \
  --description "Portal de Noticias - Projeto Full Stack com HTML e CSS avancado" \
  --homepage "https://usuario.github.io/full-stack-projeto-portal-de-noticias"
```

### Via interface web
1. Pagina principal do repositorio
2. Clicar no icone de engrenagem ao lado de "About"
3. Marcar checkbox "Use your GitHub Pages website"
4. Preencher descricao
5. Save

## Templates de README

### README minimo eficaz
```markdown
# Portal de Noticias

![Preview](./assets/screenshot.png)

Projeto desenvolvido durante o curso Full Stack da Rocketseat.

## Tecnologias

- HTML5
- CSS3 (Grid, Flexbox)

## Acesse

https://usuario.github.io/portal-de-noticias
```

### README completo (padrao Rocketseat Education)
```markdown
<h1 align="center">
  <img alt="Portal de Noticias" title="Portal de Noticias" src=".github/preview.png" width="400px" />
</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

## Projeto

O Portal de Noticias e um site responsivo construido com HTML e CSS avancado,
utilizando CSS Grid e Flexbox para criar layouts complexos e adaptaveis.

## Tecnologias

- HTML5
- CSS3
  - Grid Layout
  - Flexbox
  - Media Queries
  - Variaveis CSS

## Layout

O layout do projeto foi desenvolvido com foco em responsividade e acessibilidade.

## Como usar

1. Clone o repositorio
2. Abra o `index.html` no navegador

Ou acesse diretamente: [Portal de Noticias](https://usuario.github.io/portal-de-noticias)

## Licenca

Esse projeto esta sob a licenca MIT.
```

## Verificando status do deploy

```bash
# Verificar se Pages esta habilitado e o status do ultimo deploy
gh api repos/{owner}/{repo}/pages

# Ver o historico de deploys
gh api repos/{owner}/{repo}/pages/builds
```

## Capturando screenshot para o README

```bash
# Opcao 1: Screenshot manual (PrintScreen/Cmd+Shift+4)
# Salvar como screenshot.png na raiz ou .github/preview.png

# Opcao 2: Apos deploy, usar o proprio link do Pages
# para gerar um preview automatico em servicos como
# https://api.microlink.io/?url=https://usuario.github.io/projeto&screenshot=true
```