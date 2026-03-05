# Code Examples: Aninhamento de Tags HTML

## Exemplo 1: Enfase dentro de paragrafo

```html
<p>Um texto qualquer, e aqui temos <em>enfase neste trecho</em> do paragrafo.</p>
```

Resultado: o texto dentro de `<em>` aparece em italico. A tag `<em>` e filha de `<p>`.

## Exemplo 2: Negrito com strong

```html
<p>Texto normal e <strong>este trecho em negrito</strong> dentro do paragrafo.</p>
```

`<strong>` indica importancia semantica (negrito). Tambem e filha de `<p>`.

## Exemplo 3: Multiplos filhos no mesmo pai

```html
<p>
  Texto com <em>enfase</em> e tambem <strong>negrito</strong> no mesmo paragrafo.
</p>
```

Hierarquia:
```
p (pai)
├── em (filho 1)
└── strong (filho 2)
```

## Exemplo 4: Aninhamento em multiplos niveis

```html
<div>
  <p>
    Texto com <strong>negrito que tem <em>enfase dentro</em></strong>.
  </p>
</div>
```

Hierarquia:
```
div (avo)
└── p (pai)
    └── strong (filho)
        └── em (neto)
```

## Exemplo 5: ERRADO — fechamento fora de ordem

```html
<!-- ERRADO: strong fecha depois de p -->
<p>Texto com <strong>negrito</p></strong>
```

O browser tenta corrigir, mas o DOM resultante pode nao ser o esperado.

## Exemplo 6: CORRETO — mesma intencao, ordem certa

```html
<!-- CORRETO: strong fecha antes de p -->
<p>Texto com <strong>negrito</strong></p>
```

## Exemplo 7: ERRADO — pai fecha dentro de filho

```html
<!-- ERRADO: p fecha dentro de em -->
<p>Texto <em>com enfase</p></em>
```

## Exemplo 8: CORRETO — corrigido

```html
<!-- CORRETO -->
<p>Texto <em>com enfase</em></p>
```

## Exemplo 9: Estrutura real de pagina (aninhamento profundo)

```html
<main>
  <section>
    <h1>Titulo da <em>pagina</em></h1>
    <p>
      Paragrafo com <strong>texto importante</strong> e
      <em>texto enfatizado</em>.
    </p>
  </section>
</main>
```

Hierarquia:
```
main
└── section
    ├── h1
    │   └── em
    └── p
        ├── strong
        └── em
```

## Dica pratica: leitura de dentro pra fora

Para verificar se o aninhamento esta correto, leia as tags de fechamento de dentro pra fora:

```html
<p>Texto <strong>com <em>enfase</em></strong></p>
```

Fechamentos na ordem: `</em>` → `</strong>` → `</p>` — inverso da abertura. Correto.