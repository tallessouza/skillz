# Code Examples: Font Family em CSS

## Exemplo 1: Generico puro

```css
/* Apenas o generico — browser escolhe a melhor serif disponivel */
body {
  font-family: serif;
}
```

Resultado: geralmente Times ou similar. E a fonte padrao da maioria dos browsers.

```css
/* Sans-serif — fonte lisa */
body {
  font-family: sans-serif;
}
```

Resultado: geralmente Arial ou Helvetica dependendo do SO.

```css
/* Monospace — largura fixa, ideal pra codigo */
code {
  font-family: monospace;
}
```

## Exemplo 2: Generico fantasy

```css
body {
  font-family: fantasy;
}
```

Fonte decorativa. Raramente usada em producao, mas existe como categoria generica.

## Exemplo 3: Cadeia completa mostrada na aula

```css
body {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
```

Ordem de tentativa:
1. `"Lucida Sans"` — nao encontrou, pula
2. `"Lucida Sans Regular"` — nao encontrou, pula
3. `"Lucida Grande"` — ENCONTROU (fonte renderizada)
4. As demais nao foram necessarias

O instrutor provou removendo `"Lucida Grande"` da lista e observando a mudanca visual.

## Exemplo 4: Sem aspas (ERRO)

```css
/* ERRADO — browser nao reconhece nome com espaco sem aspas */
body {
  font-family: Lucida Sans, sans-serif;
}

/* CORRETO */
body {
  font-family: "Lucida Sans", sans-serif;
}
```

## Exemplo 5: Erro de propriedade (mostrado na aula)

O instrutor cometeu um erro ao vivo digitando `font-size` em vez de `font-family`:

```css
/* ERRADO — propriedade trocada */
body {
  font-size: sans-serif; /* sans-serif nao e valor valido pra font-size */
}

/* CORRETO */
body {
  font-family: sans-serif;
}
```

## Exemplo 6: Variacoes praticas por contexto

### Blog / site de conteudo
```css
body {
  font-family: Georgia, "Times New Roman", Times, serif;
}
```

### Aplicacao web / dashboard
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
}
```

### Terminal / bloco de codigo
```css
pre, code {
  font-family: "Courier New", Courier, monospace;
}
```

### Fallback minimo (sempre funcional)
```css
body {
  font-family: Arial, sans-serif;
}
```

## Inspecionando a fonte renderizada

```
1. F12 (abrir DevTools)
2. Clicar no elemento de texto desejado
3. Ir na aba "Computed"
4. Filtrar por "font-family"
5. Ver qual fonte esta efetivamente sendo usada
```

Isso funciona em qualquer site — util para entender qual fallback o browser escolheu.