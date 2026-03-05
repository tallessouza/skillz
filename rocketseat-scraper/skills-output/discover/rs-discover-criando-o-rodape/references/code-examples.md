# Code Examples: Criando o Rodapé

## Exemplo base da aula

### HTML

```html
<!-- Após a seção de social links -->
<footer>
  Feito com amor pela
  <a href="https://rocketseat.com.br">Rocketseat</a>
</footer>
```

### CSS

```css
footer {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
```

## Variação: Footer com múltiplos links

```html
<footer>
  <p>
    Feito com amor pela
    <a href="https://rocketseat.com.br">Rocketseat</a>
  </p>
  <p>
    <a href="https://github.com/rocketseat">GitHub</a> ·
    <a href="https://twitter.com/rockabordo">Twitter</a>
  </p>
</footer>
```

```css
footer {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
}

footer p {
  margin: 8px 0;
}

footer a {
  color: #fff;
  text-decoration: none;
}
```

## Variação: Footer com copyright

```html
<footer>
  <p>© 2024 Meu Projeto</p>
  <p>
    Feito com amor pela
    <a href="https://rocketseat.com.br">Rocketseat</a>
  </p>
</footer>
```

## Estrutura completa no contexto da página

```html
<body>
  <header>
    <!-- navegação -->
  </header>

  <main>
    <!-- conteúdo principal -->
    <section id="social-links">
      <!-- links sociais -->
    </section>
  </main>

  <footer>
    Feito com amor pela
    <a href="https://rocketseat.com.br">Rocketseat</a>
  </footer>
</body>
```

## Verificação de espaçamento com DevTools

Para confirmar que o padding está correto:

1. Abrir DevTools (F12 ou Cmd+Shift+I)
2. Selecionar o elemento `<footer>`
3. Na aba "Computed", verificar:
   - `padding-top: 24px`
   - `padding-bottom: 24px`
   - `padding-left: 0px`
   - `padding-right: 0px`
4. Passar o mouse sobre cada seção adjacente e confirmar que os espaçamentos são consistentes (24px em todas as seções)