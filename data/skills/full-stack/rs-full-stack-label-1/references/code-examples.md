# Code Examples: Label e Acessibilidade em Formulários HTML

## Exemplo 1: Campo básico com for/id (do transcript)

```html
<label for="nome">Nome</label>
<input type="text" id="nome" name="nome" placeholder="Coloque seu nome">
```

**Comportamento:**
- Leitor de tela anuncia "Nome" ao focar no input
- Clicar em "Nome" move o foco para o input
- Placeholder aparece visualmente mas não é lido

## Exemplo 2: Input dentro do label (do transcript)

```html
<label>
  Nome
  <input type="text" name="nome" placeholder="Coloque seu nome">
</label>
```

**Comportamento:**
- Associação implícita — sem necessidade de for/id
- Mesma acessibilidade que o exemplo 1
- Toda a área do label é clicável

## Exemplo 3: Campo sem label (anti-pattern do transcript)

```html
<!-- ERRADO: leitor de tela não consegue identificar o campo -->
<input type="text" name="nome" placeholder="Coloque seu nome">
```

## Variação: Formulário completo com múltiplos campos

```html
<form>
  <label for="nome">Nome</label>
  <input type="text" id="nome" name="nome" placeholder="Coloque seu nome">

  <label for="email">E-mail</label>
  <input type="email" id="email" name="email" placeholder="seu@email.com">

  <label for="mensagem">Mensagem</label>
  <textarea id="mensagem" name="mensagem" placeholder="Escreva sua mensagem"></textarea>

  <button type="submit">Enviar</button>
</form>
```

## Variação: Label oculto visualmente

```html
<label for="busca" class="visually-hidden">Buscar</label>
<input type="search" id="busca" name="busca" placeholder="Buscar...">
```

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Quando usar:** Campos de busca, ícones-input, designs minimalistas onde o contexto visual é suficiente para usuários videntes, mas leitores de tela precisam do label.

## Variação: Checkbox e radio com label

```html
<!-- Checkbox -->
<label for="aceito">
  <input type="checkbox" id="aceito" name="aceito">
  Aceito os termos de uso
</label>

<!-- Radio buttons -->
<fieldset>
  <legend>Gênero</legend>
  <label for="masculino">
    <input type="radio" id="masculino" name="genero" value="M">
    Masculino
  </label>
  <label for="feminino">
    <input type="radio" id="feminino" name="genero" value="F">
    Feminino
  </label>
</fieldset>
```

**Nota:** Para checkboxes e radios, é comum colocar o input **dentro** do label porque a área clicável maior facilita a interação.

## Variação: Select com label

```html
<label for="estado">Estado</label>
<select id="estado" name="estado">
  <option value="">Selecione</option>
  <option value="SP">São Paulo</option>
  <option value="RJ">Rio de Janeiro</option>
</select>
```

## Comparação: display:none vs visually-hidden

```html
<!-- ERRADO: esconde do leitor de tela também -->
<label for="nome" style="display: none;">Nome</label>
<input type="text" id="nome" name="nome">

<!-- ERRADO: esconde do leitor de tela também -->
<label for="nome" style="visibility: hidden;">Nome</label>
<input type="text" id="nome" name="nome">

<!-- CORRETO: invisível visualmente, visível para leitores de tela -->
<label for="nome" class="visually-hidden">Nome</label>
<input type="text" id="nome" name="nome">
```