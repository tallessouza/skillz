# Deep Explanation: Binding de Informacoes em Templates Angular

## Por que @for com track e nao track $index

O instrutor enfatiza que o `track movie.id` e obrigatorio no Angular moderno (v17+). O Angular usa o track para saber como atualizar itens de forma performatica — sem ele, o framework nao consegue identificar qual item mudou, foi adicionado ou removido, e precisa re-renderizar toda a lista.

Usar `track $index` e problematico porque se a ordem mudar (reordenacao, insercao no meio), o Angular vai re-renderizar elementos desnecessariamente. O id unico garante estabilidade.

## Property binding vs interpolacao para atributos

O instrutor usa `[src]="basePath + '/upload/' + movie.imagem"` e nao `src="{{ ... }}"`. Ambos funcionam para `src`, mas property binding e o padrao recomendado para atributos porque:

1. Permite expressoes mais complexas sem ambiguidade
2. Funciona com propriedades que nao sao strings (ex: `[disabled]="isLoading"`)
3. E consistente com o restante da API de templates Angular

## DecimalPipe: anatomia do formato '1.0-1'

O formato segue o padrao: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

- `1` = minimo 1 digito inteiro (nunca vai mostrar `.5`, sempre `0.5`)
- `.0` = minimo 0 decimais (se o numero for inteiro, mostra `5` e nao `5.0`)
- `-1` = maximo 1 decimal (arredonda `3.3486` para `3.3`)

O instrutor demonstra na pratica: sem o pipe, o valor exibido era `3.3486`. Com `number:'1.0-1'`, ficou `3.3`.

## Registro de locale: por que quebra sem ele

O Angular vem com locale americano (en-US) registrado por padrao. Quando voce passa `'pt-BR'` como terceiro parametro do DecimalPipe sem registrar o locale, o Angular lanca um erro no console: "missing locale data".

A solucao e no `app.config.ts`:
```typescript
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
registerLocaleData(pt);
```

Isso registra os dados de formatacao (separador de milhares, separador decimal, etc.) para portugues. Depois disso, o DecimalPipe sabe que em pt-BR:
- Separador decimal = virgula (`,`)
- Separador de milhares = ponto (`.`)

## Signal vs propriedade simples

O instrutor faz uma distincao importante: `basePath` e uma propriedade fixa (string constante), entao nao precisa de `signal()`. O signal e para valores reativos que mudam ao longo do tempo. Usar signal para constantes adiciona complexidade sem beneficio.

Ja `movies` vem como `input()` signal porque a lista pode mudar quando o componente pai recebe novos dados da API.

## Fluxo completo: HTTP -> componente pai -> componente filho -> template

1. `ExploreMovies` (pai) faz requisicao HTTP e recebe lista de filmes
2. Passa a lista via `[movies]="moviesList()"` para `MoviesList` (filho)
3. `MoviesList` recebe via `input()` signal
4. Template usa `@for` para iterar e renderizar cada filme
5. Cada filme mostra imagem (property binding), nota (DecimalPipe), titulo/genero/ano (interpolacao)