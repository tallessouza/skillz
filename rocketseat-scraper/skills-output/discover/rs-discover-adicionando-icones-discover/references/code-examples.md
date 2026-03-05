# Code Examples: Adicionando Icones com Ion Icons

## Exemplo 1: Setup basico (da aula)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="profile">
      <!-- conteudo do perfil -->
    </div>

    <ul>
      <!-- links de texto -->
    </ul>

    <div class="social-links">
      <a href="https://github.com/usuario"><ion-icon name="logo-github"></ion-icon></a>
      <a href="https://instagram.com/usuario"><ion-icon name="logo-instagram"></ion-icon></a>
      <a href="https://youtube.com/usuario"><ion-icon name="logo-youtube"></ion-icon></a>
      <a href="https://linkedin.com/in/usuario"><ion-icon name="logo-linkedin"></ion-icon></a>
    </div>
  </div>

  <!-- Ion Icons scripts -->
  <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</body>
</html>
```

## Exemplo 2: Teste rapido de validacao (abordagem do instrutor)

```html
<!-- Primeiro, teste com um icone simples para validar a integracao -->
<ion-icon name="heart"></ion-icon>

<!-- Se o coracao apareceu, a integracao funciona -->
<!-- Agora substitua pelos icones reais do projeto -->
```

## Exemplo 3: Variantes de icones

```html
<!-- Filled (padrao) -->
<ion-icon name="heart"></ion-icon>

<!-- Outline -->
<ion-icon name="heart-outline"></ion-icon>

<!-- Sharp -->
<ion-icon name="heart-sharp"></ion-icon>
```

## Exemplo 4: Social links com acessibilidade

```html
<div class="social-links">
  <a href="https://github.com/usuario" aria-label="GitHub">
    <ion-icon name="logo-github"></ion-icon>
  </a>
  <a href="https://instagram.com/usuario" aria-label="Instagram">
    <ion-icon name="logo-instagram"></ion-icon>
  </a>
  <a href="https://youtube.com/usuario" aria-label="YouTube">
    <ion-icon name="logo-youtube"></ion-icon>
  </a>
  <a href="https://linkedin.com/in/usuario" aria-label="LinkedIn">
    <ion-icon name="logo-linkedin"></ion-icon>
  </a>
</div>
```

## Exemplo 5: Estilizacao basica dos social links

```css
.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-links a {
  color: #fff;
  font-size: 24px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #8c52ff;
}
```

## Exemplo 6: Outros icones sociais disponiveis

```html
<!-- Redes sociais comuns no Ion Icons -->
<ion-icon name="logo-twitter"></ion-icon>
<ion-icon name="logo-facebook"></ion-icon>
<ion-icon name="logo-twitch"></ion-icon>
<ion-icon name="logo-discord"></ion-icon>
<ion-icon name="logo-tiktok"></ion-icon>
<ion-icon name="logo-whatsapp"></ion-icon>
```

## Exemplo 7: Icones genericos uteis

```html
<!-- Navegacao -->
<ion-icon name="menu"></ion-icon>
<ion-icon name="close"></ion-icon>
<ion-icon name="arrow-back"></ion-icon>

<!-- Acoes -->
<ion-icon name="search"></ion-icon>
<ion-icon name="share-social"></ion-icon>
<ion-icon name="download"></ion-icon>

<!-- Status -->
<ion-icon name="checkmark-circle"></ion-icon>
<ion-icon name="alert-circle"></ion-icon>
<ion-icon name="information-circle"></ion-icon>
```