# Code Examples: Input Number no HTML

## Exemplo 1: Campo básico sem atributos

```html
<!-- Campo genérico — evitar em produção -->
<input type="number" />
```

O campo aceita qualquer número, sem limites, sem obrigatoriedade.

## Exemplo 2: Com min e max

```html
<!-- Range de 16 a 18 -->
<input type="number" min="16" max="18" />
```

O campo se ajusta visualmente. As setas só permitem navegar entre 16, 17 e 18. Digitação manual ainda aceita valores fora do range, mas o submit bloqueia.

## Exemplo 3: Com min, max e step

```html
<!-- De 0 a 18, pulando de 2 em 2 -->
<input type="number" min="0" max="18" step="2" />
```

Valores válidos nas setas: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18.

## Exemplo 4: Campo completo com todos os atributos

```html
<input
  type="number"
  min="0"
  max="18"
  step="2"
  required
  placeholder="0 até 18"
/>
```

## Exemplo 5: Cenário real — formulário de idade

```html
<form>
  <label for="idade">Idade:</label>
  <input
    type="number"
    id="idade"
    name="idade"
    min="16"
    max="120"
    step="1"
    required
    placeholder="Sua idade"
  />
  <button type="submit">Enviar</button>
</form>
```

## Exemplo 6: Cenário real — quantidade de produtos

```html
<form>
  <label for="quantidade">Quantidade:</label>
  <input
    type="number"
    id="quantidade"
    name="quantidade"
    min="1"
    max="99"
    step="1"
    required
    placeholder="1"
  />
  <button type="submit">Adicionar ao carrinho</button>
</form>
```

## Exemplo 7: Step com valores decimais

```html
<!-- Para preços ou medidas com casas decimais -->
<input
  type="number"
  min="0"
  max="1000"
  step="0.01"
  placeholder="0.00"
/>
```

## Demonstração do comportamento de validação

```html
<!-- Teste: digite 40 manualmente e clique Submit -->
<form>
  <input type="number" min="0" max="18" />
  <button type="submit">Submit</button>
</form>
<!-- Resultado: browser bloqueia com mensagem "O valor deve ser menor ou igual a 18" -->
```