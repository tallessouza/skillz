# Code Examples: SlicePipe para Manipulacao de Textos

## Exemplo 1: Truncar texto (start=0, end=3)

```typescript
import { Component } from '@angular/core';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [SlicePipe],
  template: `<p>{{ texto | slice:0:3 }}</p>`
})
export class AppComponent {
  texto = 'Este é o texto completo que será truncado';
}
```

**Calculo:**
- String: `E s t e ...`
- Indices: `0 1 2 3 ...`
- Start=0: comeca em "E"
- End=3: para antes do indice 3 (antes do "e")
- Resultado: `Est` (3 caracteres: indices 0, 1, 2)

## Exemplo 2: Extrair do final (start=-4)

```typescript
@Component({
  selector: 'app-root',
  imports: [SlicePipe],
  template: `<p>{{ texto | slice:-4 }}</p>`
})
export class AppComponent {
  texto = 'Olá, Mundo!';
}
```

**Calculo:**
- String: `O l á ,   M u n d o !`
- Start=-4: conta 4 do final → `d o ! ` → nao, vamos contar: `n d o !`
- Sem end: vai ate o final
- Resultado: `do!` (ultimos 4 caracteres contando espaco se houver)

## Exemplo 3: Extrair secao central (start=4, end=10)

```typescript
@Component({
  selector: 'app-root',
  imports: [SlicePipe],
  template: `<p>{{ texto | slice:4:10 }}</p>`
})
export class AppComponent {
  texto = 'Olá, mundo, tudo bem?';
}
```

**Calculo:**
- Indices: `O(0) l(1) á(2) ,(3) (4) m(5) u(6) n(7) d(8) o(9) ,(10)`
- Start=4: comeca no espaco (indice 4)
- End=10: para antes da virgula (indice 10), ultimo incluido e `o` (indice 9)
- Resultado: ` mundo` (indices 4 a 9)

## Exemplo 4: End negativo (start=1, end=-1)

```typescript
@Component({
  selector: 'app-root',
  imports: [SlicePipe],
  template: `<p>{{ texto | slice:1:-1 }}</p>`
})
export class AppComponent {
  texto = 'Texto completo!';
}
```

**Calculo:**
- Start=1: pula o primeiro caractere "T", comeca em "e"
- End=-1: exclui o ultimo caractere "!"
- Resultado: `exto completo` (do indice 1 ate o penultimo)

## Variacoes praticas

### Truncar com reticencias condicional

```html
<p>
  {{ descricao | slice:0:100 }}
  @if (descricao.length > 100) {
    ...
  }
</p>
```

### Mostrar primeiras N palavras (combinado com logica)

```typescript
// No componente, calcule o indice de corte
get indiceDaQuintaPalavra(): number {
  let espacos = 0;
  for (let i = 0; i < this.texto.length; i++) {
    if (this.texto[i] === ' ') espacos++;
    if (espacos === 5) return i;
  }
  return this.texto.length;
}
```

```html
<p>{{ texto | slice:0:indiceDaQuintaPalavra }}</p>
```

### Extrair extensao de arquivo

```html
<!-- Pega os ultimos 4 caracteres (ex: .pdf, .txt) -->
<span>{{ nomeArquivo | slice:-4 }}</span>
```