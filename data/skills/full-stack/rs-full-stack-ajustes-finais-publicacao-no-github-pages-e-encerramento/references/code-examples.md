# Code Examples: Publicacao no GitHub Pages e Ajustes Pos-Deploy

## Fix de scroll horizontal

### O problema (so aparece em producao)

```css
/* Antes: apenas no html */
html {
  overflow-x: hidden;
}
/* Funciona no dev local, mas em alguns navegadores em producao o scroll horizontal volta */
```

### A solucao

```css
/* Depois: html E body */
html, body {
  overflow-x: hidden;
}
```

### Commit message usado pelo instrutor

```
remove scroll horizontal
```

## Template de README profissional

Baseado no exemplo mostrado pelo instrutor (skillz-education):

```markdown
<h1 align="center">
  <img alt="Nome do Projeto" title="Nome do Projeto" src=".github/logo.png" />
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licenca">Licenca</a>
</p>

<p align="center">
  <img alt="Preview do projeto" src=".github/preview.png" width="100%">
</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- HTML
- CSS
- JavaScript
- [Outra tecnologia]

## 💻 Projeto

Descricao breve do que o projeto faz e qual problema resolve.

[Acesse o projeto finalizado, online](https://seuusuario.github.io/seurepositorio/)

## 🔖 Layout

Voce pode visualizar o layout do projeto atraves [desse link](URL_DO_FIGMA).

## 📝 Licenca

Esse projeto esta sob a licenca MIT.

---

Feito com ♥ by [Seu Nome](https://github.com/seuusuario)
```

## Fluxo github.dev

```
1. Acesse github.com/{user}/{repo}
2. Pressione "." no teclado
3. URL muda para github.dev/{user}/{repo}
4. VS Code abre no navegador
5. Edite os arquivos necessarios
6. Source Control (Ctrl+Shift+G) → stage → commit → push
```

## Debugging de cache no DevTools

```
1. F12 (abrir DevTools)
2. Aba "Network"
3. Marcar checkbox "Disable cache"
4. Ctrl+Shift+R (hard refresh)
5. Verificar se o CSS atualizado esta sendo servido:
   - Aba "Elements" → inspecionar o body → verificar overflow-x
```

## Configuracao do GitHub Pages

```
Settings → Pages → Source: "Deploy from a branch"
Branch: main → / (root)
Save

Link gerado: https://{usuario}.github.io/{repositorio}/
```