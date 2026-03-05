# Code Examples: Configurando Prettier para Angular

## Comandos de instalacao completos

```bash
# Instalar Prettier com versao especifica
npm install --save-dev prettier@3.1.0

# Instalar plugin de integracao ESLint + Prettier
npm install --save-dev eslint-plugin-prettier@5.0.1
```

## Teste de formatacao — Template Angular

### Antes (sem plugins Angular):

```html
<!-- app.component.html -->
@if (true) {
<h1>Hello</h1>
}
```

O `<h1>` fica sem indentacao, colado com o `@if`.

### Depois (com plugins Angular):

```html
<!-- app.component.html -->
@if (true) {
  <h1>Hello</h1>
}
```

O `<h1>` recebe indentacao correta dentro do bloco `@if`.

## Configuracoes VS Code (settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Verificacao no package.json

Apos instalacao, confirme que os pacotes apareceram em `devDependencies`:

```json
{
  "devDependencies": {
    "prettier": "3.1.0",
    "eslint-plugin-prettier": "5.0.1"
  }
}
```

## Exemplo completo com multiplos blocos Angular

```html
<!-- Teste com varios blocos de control flow -->
@if (isLoading) {
  <div class="spinner">
    <p>Carregando...</p>
  </div>
} @else {
  @for (item of items; track item.id) {
    <div class="card">
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  }
}
```

Com os plugins instalados, toda essa estrutura mantem indentacao consistente ao salvar.