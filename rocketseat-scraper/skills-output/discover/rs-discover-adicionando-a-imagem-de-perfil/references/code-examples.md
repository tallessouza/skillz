# Code Examples: Adicionando Imagem de Perfil

## Exemplo 1: Estrutura basica do profile

```html
<!-- Container do perfil com ID para estilizacao futura -->
<div id="profile">
  <img
    src="./assets/avatar.png"
    alt="Foto de Mike Brito sorrindo, usando oculos e camisa preta, barba e fundo amarelo"
  >
</div>
```

## Exemplo 2: Imagem de fonte remota (GitHub)

```html
<!-- Demonstracao de que src funciona com qualquer URL do mundo -->
<img
  src="https://github.com/maykbrito.png"
  alt="Foto de perfil de Mayk Brito no GitHub"
>
```

O instrutor demonstra que o `src` aceita tanto caminhos locais quanto URLs remotas, mostrando ambas as abordagens lado a lado.

## Exemplo 3: Variacoes de alt text

### Para foto de pessoa
```html
<img src="./assets/avatar.png"
  alt="Foto de Ana Silva sorrindo, cabelo castanho, usando blazer cinza em fundo branco">
```

### Para logo
```html
<img src="./assets/logo.png"
  alt="Logo da Rocketseat, foguete roxo com texto ao lado">
```

### Para imagem decorativa (sem conteudo informativo)
```html
<img src="./assets/decorative-wave.svg" alt="">
```

### Para grafico ou diagrama
```html
<img src="./assets/sales-chart.png"
  alt="Grafico de barras mostrando crescimento de vendas de janeiro a junho 2024, com pico em marco">
```

## Exemplo 4: Estrutura de pastas do projeto

```
projeto/
├── index.html
└── assets/
    ├── avatar.png        ← exportado do Figma em 3x
    └── bg-mobile.png     ← background mobile
```

## Exemplo 5: Atalho Emmet para criar div com ID

Digitando no editor:
```
#profile
```
E pressionando Enter/Tab, o Emmet gera:
```html
<div id="profile"></div>
```

Digitando:
```
#profile>img
```
E pressionando Enter/Tab, gera:
```html
<div id="profile">
  <img src="" alt="">
</div>
```

## Exemplo 6: Profile card completo (extensao do padrao da aula)

```html
<div id="profile">
  <img
    src="./assets/avatar.png"
    alt="Foto de Mike Brito sorrindo, usando oculos e camisa preta, barba e fundo amarelo"
  >
  <h1>Mike Brito</h1>
  <p>Educator at Rocketseat</p>
</div>
```