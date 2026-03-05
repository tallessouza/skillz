# Code Examples: Diferencas entre Navegadores

## Exemplos de CSS que renderiza diferente entre navegadores

### Exemplo 1: Scrollbar styling

```css
/* Funciona em Chromium (Edge/Chrome), nao em Firefox */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* Firefox usa propriedade diferente */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

### Exemplo 2: Backdrop filter

```css
.glass-effect {
  /* Funciona em Edge/Chrome sem prefix */
  backdrop-filter: blur(10px);
  
  /* Safari precisa de prefix */
  -webkit-backdrop-filter: blur(10px);
}
```

### Exemplo 3: User-agent styles diferentes

```css
/* Reset para garantir consistencia entre navegadores */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Inputs tem estilos default muito diferentes entre navegadores */
input, button, textarea, select {
  font: inherit; /* Herda font do parent em vez de usar default do navegador */
}
```

### Exemplo 4: Font rendering

```css
body {
  /* Garante anti-aliasing consistente */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Como verificar se e diferenca de navegador

```bash
# 1. Abra o mesmo arquivo HTML em Edge e no navegador que esta usando
# 2. Compare visualmente lado a lado
# 3. Use DevTools (F12) para inspecionar computed styles

# Atalho no Edge/Chrome:
# F12 → Elements → Computed → compare valores
```

## Extensao Momentum — instalacao

```
1. Abra Edge
2. Navegue para: https://chrome.google.com/webstore
3. Pesquise: "Momentum"
4. Clique: "Add to Chrome"
5. Confirme a instalacao
6. Abra nova aba (Ctrl+T) para verificar
```