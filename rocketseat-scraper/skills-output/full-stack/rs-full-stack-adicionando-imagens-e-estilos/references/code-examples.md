# Code Examples: Adicionando Imagens e Estilos

## Estrutura do projeto

```
pagina-receita/
├── index.html
├── style.css
├── assets/
│   ├── bg.jpg
│   └── main-image.jpg
└── .gitignore
```

## HTML — Integrando a imagem

```html
<!-- Dentro da section page-image -->
<div class="page-image">
  <img src="assets/main-image.jpg" alt="Imagem de um cupcake com graos de cafe e chantilly">
</div>
```

### Variacoes de alt text por contexto

```html
<!-- Imagem decorativa (sem informacao relevante) -->
<img src="assets/bg.jpg" alt="">

<!-- Imagem com conteudo informativo -->
<img src="assets/main-image.jpg" alt="Cupcake decorado com graos de cafe e chantilly sobre fundo escuro">

<!-- Imagem que e um link -->
<a href="/receita">
  <img src="assets/main-image.jpg" alt="Ver receita do cupcake com cafe">
</a>
```

## CSS — Linkando e aplicando border-radius

### Link no HTML

```html
<link rel="stylesheet" href="style.css">
```

### style.css

```css
.page-image img {
  border-radius: 16px;
}
```

### Variacoes de border-radius

```css
/* Bordas iguais (como na aula) */
.page-image img {
  border-radius: 16px;
}

/* Bordas diferentes por canto */
.page-image img {
  border-radius: 16px 16px 0 0; /* so arredonda em cima */
}

/* Circular (para imagens quadradas) */
.avatar img {
  border-radius: 50%;
}
```

## .gitignore

```gitignore
.DS_Store
```

### Variacoes comuns para projetos web

```gitignore
# macOS
.DS_Store

# Windows
Thumbs.db

# IDEs
.vscode/
.idea/

# Dependencias
node_modules/
```

## Workflow de exportacao do Figma

```
1. Selecionar o elemento no Figma
2. Se tem border-radius → zerar para 0
3. Painel Export → selecionar JPG (ou PNG se precisa transparencia)
4. Clicar "Export"
5. Salvar na pasta assets/ com nome semantico
6. CTRL+Z no Figma para restaurar o border-radius original
7. No CSS, aplicar border-radius equivalente
```

## Primeiro commit

```bash
# Criar .gitignore primeiro
echo ".DS_Store" > .gitignore

# Adicionar tudo
git add .

# Commit
git commit -m "Adicionando imagens e estilo"
```