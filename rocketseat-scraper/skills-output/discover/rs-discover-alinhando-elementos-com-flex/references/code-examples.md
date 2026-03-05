# Code Examples: Alinhando Elementos com Flexbox

## Exemplo 1: Propriedades sem efeito em elemento com filho único

O instrutor aplica flex a um elemento `<a>` que contém apenas texto:

```css
/* Aplicado ao <a> */
a {
  display: flex;          /* EFEITO: faz o <a> ocupar todo espaço disponível */
  flex-direction: row;    /* SEM EFEITO: row já é o padrão */
  gap: 8px;               /* SEM EFEITO: apenas 1 conteúdo filho (o texto) */
  justify-content: center; /* EFEITO: centraliza o texto horizontalmente */
  align-items: center;     /* EFEITO: centraliza verticalmente (se houver altura) */
}
```

### Versão limpa (sem propriedades redundantes):

```css
a {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Exemplo 2: Alternativa sem flex para texto

```css
/* Funciona igualmente para centralizar texto */
a {
  display: block;
  text-align: center;
}
```

## Exemplo 3: Demonstrando align-items com altura explícita

O instrutor adiciona altura para mostrar o efeito de `align-items`:

```css
/* Sem align-items: center — texto fica no topo */
a {
  display: flex;
  height: 52px;
}

/* Com align-items: center — texto vai para o meio vertical */
a {
  display: flex;
  height: 52px;
  align-items: center;
}
```

## Exemplo 4: Usando padding em vez de height

Abordagem final do instrutor — padding cria o espaço vertical necessário:

```css
a {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
}
```

## Variações práticas

### Centralização completa de um botão

```css
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 32px;
}
```

### Card com conteúdo centralizado

```css
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; /* altura mínima para align-items ter efeito */
}
```

### Navbar com itens centralizados verticalmente

```css
.navbar {
  display: flex;
  align-items: center;  /* centraliza verticalmente */
  gap: 16px;            /* gap faz sentido aqui — múltiplos filhos */
  padding: 0 24px;
  height: 64px;
}
```

Note que neste caso `gap: 16px` **faz sentido** porque a navbar tem múltiplos filhos (logo, links, botão). Contraste com o exemplo do `<a>` onde gap não tinha efeito.