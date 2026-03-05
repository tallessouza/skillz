# Code Examples: Publicando no GitHub com GitHub Pages

## Exemplo de README para projetos de animacao CSS

```markdown
# 🛼 Patins Animation

Projeto desenvolvido na trilha Full Stack da Rocketseat para treinar animacoes e transicoes CSS.

![Preview do projeto](./assets/preview.png)

## 🚀 Tecnologias

- HTML5
- CSS3 (Animations, Transitions, Scroll-driven Animations)

## 🔗 Deploy

Acesse o projeto: [https://usuario.github.io/patins-animation](https://usuario.github.io/patins-animation)

## 📚 Aprendizados

- Keyframe animations
- CSS Transitions
- Scroll-driven animations (scroll-timeline)
- Transform e rotate
- Animation timing functions
```

## Fluxo completo de publicacao via CLI

```bash
# 1. Limpar configs de dev
# (editar CSS, remover zoom ou debug styles)
git add .
git commit -m "chore: remove development zoom config"

# 2. Criar repositorio e publicar
gh repo create patins-animation --public --source=. --push

# 3. Configurar GitHub Pages via CLI
gh api repos/{owner}/{repo}/pages -X POST -f source='{"branch":"main","path":"/"}'

# 4. Adicionar metadata
gh repo edit --description "Projeto para treinar animacoes CSS - Trilha Full Stack Rocketseat"
gh repo edit --homepage "https://usuario.github.io/patins-animation"

# 5. Verificar deploy
sleep 60
curl -s -o /dev/null -w "%{http_code}" https://usuario.github.io/patins-animation
# Esperado: 200
```

## Configuracao do GitHub Pages via interface

```
GitHub.com → Repositorio → Settings → Pages

Source: Deploy from a branch
Branch: main
Folder: / (root)
[Save]

Aguardar mensagem: "Your site is live at https://..."
```

## Exemplo de .gitignore para projetos estaticos

```gitignore
# OS files
.DS_Store
Thumbs.db

# Editor
.vscode/
*.swp

# Dev configs que nao devem ir para producao
# (melhor remover do codigo do que ignorar no git)
```