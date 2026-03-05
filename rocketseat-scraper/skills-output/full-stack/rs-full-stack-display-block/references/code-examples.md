# Code Examples: Display Block

## Exemplo 1: Block ocupa toda a linha

Direto da aula — o instrutor mostra que uma div com borda se estende horizontalmente por toda a largura disponivel.

```html
<div>block</div>
```

```css
div {
  border: 1px solid black;
}
```

**Resultado:** A borda se estende de ponta a ponta do viewport (ou container pai). O texto "block" ocupa apenas uma pequena parte, mas o elemento inteiro reclama a linha.

## Exemplo 2: Duas divs empilham verticalmente

```html
<div>Primeiro</div>
<div>Segundo</div>
```

```css
div {
  border: 1px solid black;
}
```

**Resultado:** Cada div ocupa sua propria linha. Elas empilham verticalmente, nunca ficam lado a lado.

## Exemplo 3: Width e height aplicados

O instrutor demonstra que dimensoes sao respeitadas:

```css
div {
  width: 200px;
  height: 200px;
  border: 1px solid black;
}
```

**Resultado:** A div se torna um quadrado de 200x200 pixels. Diferente de um `<span>` (inline), as dimensoes sao aplicadas imediatamente.

## Exemplo 4: Box model completo

O exemplo final da aula com todas as propriedades:

```css
div {
  width: 200px;
  height: 200px;
  padding: 20px;
  margin: 20px;
  border: 1px solid black;
}
```

**Resultado:**
- Conteudo: 200x200px
- Padding: 20px em cada lado (area interna entre conteudo e borda)
- Border: 1px em cada lado
- Margin: 20px em cada lado (espaco externo entre o elemento e vizinhos)
- Tamanho visual total (sem margin): 242x242px (200 + 20*2 + 1*2)

## Variacoes praticas

### Block com largura limitada e centralizacao

```css
.container {
  width: 600px;
  margin: 0 auto; /* centraliza horizontalmente */
  padding: 20px;
  border: 1px solid #ccc;
}
```

### Block responsivo

```css
.card {
  width: 100%;
  max-width: 400px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

### Comparacao: block vs inline

```html
<div style="border: 1px solid red; width: 200px; height: 100px; margin: 20px; padding: 10px;">
  Sou block — tudo funciona
</div>

<span style="border: 1px solid blue; width: 200px; height: 100px; margin: 20px; padding: 10px;">
  Sou inline — width, height e margin vertical sao ignorados
</span>
```