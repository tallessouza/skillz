# Code Examples: Setup de Projeto de Formulário HTML

## Estrutura final de pastas do projeto

```
formulario-de-matricula/
├── assets/
│   ├── icons/
│   │   ├── alert-circle.svg
│   │   ├── mail.svg
│   │   ├── user.svg
│   │   ├── lock.svg
│   │   ├── calendar.svg
│   │   ├── chevron-down.svg
│   │   ├── upload.svg
│   │   └── ... (demais ícones do style guide)
│   ├── ilustration.svg
│   └── logo.svg
├── index.html
└── style.css
```

## SVG como XML — exemplo de ícone exportado

```xml
<!-- Exemplo de um ícone SVG exportado do Figma -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#333333" stroke-width="2"/>
  <path d="M12 8V12" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
  <path d="M12 16H12.01" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
</svg>
```

Note: tem tags (`<svg>`, `<path>`), atributos (`width`, `viewBox`, `stroke`), estrutura XML — idêntico a HTML.

## SVG inline no HTML (estratégia mencionada pelo instrutor)

```html
<!-- Em vez de referenciar como imagem: -->
<img src="assets/icons/mail.svg" alt="Email icon">

<!-- Inserir direto no HTML (permite customização via CSS): -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
</svg>
```

A vantagem do inline: `stroke="currentColor"` herda a cor do CSS pai, permitindo trocar cor do ícone via CSS.

## Tipos de input que o projeto cobre

```html
<!-- Texto -->
<input type="text" name="nome" placeholder="Seu nome completo">

<!-- Email -->
<input type="email" name="email" placeholder="Seu email">

<!-- Data -->
<input type="date" name="nascimento">

<!-- Seleção (dropdown) -->
<select name="curso">
  <option value="">Selecione um curso</option>
  <option value="frontend">Frontend</option>
  <option value="backend">Backend</option>
</select>

<!-- Textarea (multilinha) -->
<textarea name="observacoes" rows="4" placeholder="Observações"></textarea>

<!-- Upload de arquivo -->
<input type="file" name="documento">

<!-- Radio (desafiador de customizar) -->
<input type="radio" name="periodo" value="manha" id="manha">
<label for="manha">Manhã</label>

<!-- Checkbox (desafiador de customizar) -->
<input type="checkbox" name="termos" id="termos">
<label for="termos">Aceito os termos</label>
```

## Layout split: lado fixo + scroll

```css
/* Estrutura básica do layout mencionado */
body {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 50%;
  position: fixed;
  height: 100vh;
  /* Ilustração fica aqui, fixa na tela */
}

.content {
  width: 50%;
  margin-left: 50%;
  overflow-y: auto;
  /* Formulário fica aqui, com scroll */
}
```