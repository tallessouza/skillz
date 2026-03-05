# Code Examples: Campo de Envio de Arquivos

## Exemplo completo: HTML da drop zone

```html
<div class="drop-zone">
  <label for="birth-file">Certidão de Nascimento</label>
  
  <div class="drop-area">
    <!-- SVG inline para controle de cor via CSS -->
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 6v20M6 16h20" stroke="var(--stroke)" stroke-width="2" stroke-linecap="round"/>
    </svg>
    
    <p>Arraste o arquivo ou clique para enviar</p>
    
    <!-- Input invisivel cobrindo toda a area -->
    <input type="file" id="birth-file" name="birth-file" />
  </div>
</div>
```

## Exemplo completo: CSS drop-area.css

```css
/* Container da drop zone */
.drop-area {
  position: relative;
  border: 1px dashed var(--stroke);
  border-radius: 0.25rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1.75rem 1rem;
}

/* Texto dentro da drop zone */
.drop-area p {
  color: var(--text-secondary);
}

/* Input file invisivel cobrindo toda a area */
.drop-area input {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* Hover: borda mais grossa, cor highlight, fundo secondary */
.drop-area:hover,
.drop-area:has(input:focus) {
  border-width: 2px;
  border-color: var(--stroke-highlight);
  background-color: var(--surface-secondary);
}

/* Hover: cor do texto muda */
.drop-area:hover p,
.drop-area:has(input:focus) p {
  color: var(--text-tertiary);
}

/* Hover: cor do SVG muda via stroke */
.drop-area:hover svg path,
.drop-area:has(input:focus) svg path {
  stroke: var(--stroke-highlight);
}
```

## Exemplo: Cadeia de imports CSS

```css
/* index.css (raiz) */
@import "./form.css";

/* form.css */
@import "./fields/index.css";

/* fields/index.css */
@import "./drop-area.css";
```

## Exemplo: Textarea com rows reduzido

```html
<!-- Antes: muito grande -->
<textarea rows="10" name="notes"></textarea>

<!-- Depois: tamanho adequado -->
<textarea rows="6" name="notes"></textarea>
```

## Exemplo: focus-within para input date

```css
/* Captura foco em qualquer sub-elemento do date picker */
input[type="date"]:focus-within {
  border-color: var(--stroke-highlight);
  background-color: var(--surface-secondary);
}
```

## Variação: Drop zone com ícone de upload (fill)

```css
/* Se o SVG usa fill ao invés de stroke */
.drop-area:hover svg path,
.drop-area:has(input:focus) svg path {
  fill: var(--stroke-highlight);
}
```

## Variação: Drop zone com accept filter

```html
<!-- Restringir tipos de arquivo aceitos -->
<input type="file" id="birth-file" name="birth-file" accept=".pdf,.jpg,.png" />
```

## Variação: Múltiplos arquivos

```html
<!-- Permitir upload de múltiplos arquivos -->
<input type="file" id="documents" name="documents" multiple />
```