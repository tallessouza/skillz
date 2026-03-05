# Code Examples: Estilizando o Track

## Exemplo da aula — Track do Switch

O instrutor copia propriedades do Figma e converte para CSS com variaveis:

```css
/* Propriedades copiadas do Figma e convertidas */
.switch span {
  display: block;
  width: 52px;
  height: 32px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
```

### Passo a passo do instrutor:

1. Copiou width e height do Figma (valores fixos)
2. Viu que o fundo era "Surface Color Dark Mode" → `var(--surface-color)`
3. Viu que a borda era "Stroke Color" → `var(--stroke-color)`
4. Copiou backdrop-filter e adicionou prefixo `-webkit-`
5. Percebeu que o span nao aceitava width → adicionou `display: block`
6. Aplicou `border-radius: 9999px` conforme o design

## Variacao: Track com inline-block (quando precisa ficar na mesma linha)

```css
.switch span {
  display: inline-block; /* aceita width/height mas nao quebra linha */
  width: 52px;
  height: 32px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
  vertical-align: middle; /* alinha com texto adjacente */
}
```

## Variacao: Track responsivo com min/max

```css
.switch span {
  display: block;
  min-width: 44px;
  max-width: 60px;
  height: 28px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
}
```

## Variacao: Track com transicao para estado ativo

```css
.switch span {
  display: block;
  width: 52px;
  height: 32px;
  background-color: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}

.switch input:checked + span {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
```

## Demonstracao: Diferenca entre 50% e 9999px

```css
/* Com border-radius: 50% em retangulo → elipse */
.elipse {
  width: 52px;
  height: 32px;
  border-radius: 50%; /* resultado: elipse, NAO pill */
}

/* Com border-radius: 9999px em retangulo → pill perfeita */
.pill {
  width: 52px;
  height: 32px;
  border-radius: 9999px; /* resultado: pill perfeita */
}
```

## HTML tipico do switch com track

```html
<label class="switch">
  <input type="checkbox" />
  <span></span> <!-- este e o track estilizado -->
</label>
```