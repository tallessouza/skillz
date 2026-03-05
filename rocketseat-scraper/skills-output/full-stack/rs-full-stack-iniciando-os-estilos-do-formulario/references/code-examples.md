# Code Examples: Estilizacao de Formularios com CSS

## Estrutura de arquivos CSS

```
css/
├── forms.css              # form, fieldset, legend
└── fields/
    └── index.css          # input, select, textarea, label, focus states
```

### forms.css

```css
@import url("fields/index.css");

form {
  margin-top: 3rem;
}

fieldset {
  border: none;
  display: grid;
  gap: 1.5rem;
}

legend {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  font-family: var(--font-default);
  margin-bottom: 1.5rem;
}
```

### fields/index.css

```css
input,
textarea,
select {
  appearance: none;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--stroke-default);
  padding: 0.75rem 1rem;
  font: var(--text);
}

label {
  font: var(--text-small);
  color: var(--text-secondary);
  display: block;
  margin-bottom: 0.25rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: 0.125rem solid var(--surface-secondary);
  border: 0.125rem solid var(--stroke-highlight);
  outline-offset: 1px;
}
```

## Variacoes de focus state

### Foco minimalista (apenas borda)

```css
input:focus,
select:focus,
textarea:focus {
  border-color: var(--stroke-highlight);
  outline: none;
}
```

### Foco com sombra (alternativa ao outline)

```css
input:focus,
select:focus,
textarea:focus {
  border-color: var(--stroke-highlight);
  box-shadow: 0 0 0 0.125rem var(--surface-secondary);
  outline: none;
}
```

### Foco acessivel (alto contraste)

```css
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 0.125rem solid var(--surface-secondary);
  border: 0.125rem solid var(--stroke-highlight);
  outline-offset: 2px;
}
```

## Exemplo completo: formulario de matricula

```html
<form>
  <fieldset>
    <legend>Dados Pessoais</legend>

    <div>
      <label for="name">Nome completo</label>
      <input type="text" id="name" name="name" />
    </div>

    <div>
      <label for="email">E-mail</label>
      <input type="email" id="email" name="email" />
    </div>

    <div>
      <label for="course">Curso</label>
      <select id="course" name="course">
        <option value="">Selecione</option>
        <option value="fullstack">Full Stack</option>
        <option value="frontend">Front-end</option>
      </select>
    </div>

    <div>
      <label for="message">Mensagem</label>
      <textarea id="message" name="message"></textarea>
    </div>
  </fieldset>
</form>
```

## Reset de select com seta customizada

```css
/* Apos appearance: none remover a seta nativa */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* seta SVG inline */
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem; /* espaco para a seta */
}
```

## Grid vs Flex para fieldset

```css
/* Grid: espacamento uniforme automatico (recomendado pelo instrutor) */
fieldset {
  display: grid;
  gap: 1.5rem;
}

/* Flex: alternativa quando precisa de campos lado a lado */
fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

fieldset > div {
  flex: 1 1 300px; /* campos responsivos lado a lado */
}
```