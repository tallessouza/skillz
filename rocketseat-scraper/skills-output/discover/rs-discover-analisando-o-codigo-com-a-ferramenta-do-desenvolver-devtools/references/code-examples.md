# Code Examples: Analisando Layout com DevTools

## Exemplo 1: Descobrindo padding faltante

**Situacao:** O design especifica padding lateral de 24px no container, mas visualmente parece que nao foi aplicado.

**Passo 1:** Inspecionar o `.container` no DevTools

```
Box Model mostra:
- margin: 0 auto (margens laterais automaticas)
- border: 0
- padding: 0 (PROBLEMA — deveria ser 24px nas laterais)
- content: 360 x 459.16
```

**Passo 2:** Aplicar a correcao no CSS

```css
/* Antes — sem padding */
.container {
  width: 360px;
  margin: 0 auto;
}

/* Depois — com padding lateral de 24px */
.container {
  width: 360px;
  margin: 0 auto;
  padding: 0 24px;
}
```

**Passo 3:** Verificar no DevTools apos a correcao

```
Box Model agora mostra:
- margin: 0 auto
- border: 0
- padding: 0 24px (CORRETO)
- content: area ajustada
```

## Exemplo 2: Identificando display padrao via Computed

**Objetivo:** Confirmar que `<a>` tem `display: inline` por padrao.

**Passo 1:** Selecionar um elemento `<a>` no DevTools
**Passo 2:** Ir na aba Computed
**Passo 3:** Filtrar por `display`
**Passo 4:** Se voce definiu `display: flex`, remova temporariamente
**Passo 5:** O Computed mostra `display: inline` — confirmando o user agent style

```css
/* User agent stylesheet (injetado pelo browser) */
a {
  display: inline; /* padrao do navegador */
}

/* Seu estilo (sobrescreve o padrao) */
a {
  display: flex; /* voce definiu */
}
```

## Exemplo 3: Identificando estilos injetados por plugins

Ao inspecionar o HTML, voce pode encontrar:

```html
<!-- Injetado pelo Grammarly -->
<grammarly-desktop-integration data-grammarly-shadow-root="true"></grammarly-desktop-integration>

<!-- Injetado pelo Live Server -->
<script type="text/javascript">
  // Live Server injected code for hot reload
</script>

<!-- Atributos que voce NAO colocou -->
<body class="vsc-initialized" data-new-gr-c-s-check-loaded="true">
```

**Como identificar:** DevTools mostra a origem de cada estilo. Se nao veio do seu arquivo CSS, e injetado.

## Exemplo 4: Lendo warnings de compatibilidade

Ao usar `backdrop-filter`, o DevTools pode mostrar:

```
⚠ backdrop-filter is not supported by Firefox, Firefox for Android
  Shift+click to see recommendations
```

**Acao:** Clicar no link para entender as alternativas e decidir se precisa de fallback.

## Atalhos para abrir DevTools

| Sistema | Atalho | Alternativa |
|---------|--------|-------------|
| Windows/Linux | `F12` | `Ctrl+Shift+I` |
| Mac | `F12` | `Cmd+Option+I` |
| Qualquer | Botao direito → Inspecionar | — |

## Dica de posicionamento do DevTools

- **Embaixo:** melhor para analisar layout horizontal (nao comprime a viewport)
- **Lateral:** util para sites verticais, mas comprime a viewport horizontal
- **Desconexo (janela separada):** ideal quando voce tem dois monitores