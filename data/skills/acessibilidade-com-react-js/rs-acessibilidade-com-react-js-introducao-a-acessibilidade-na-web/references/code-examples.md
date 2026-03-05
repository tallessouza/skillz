# Code Examples: Acessibilidade na Web

## Imagens acessiveis

```tsx
// ERRADO: imagem sem descricao
<img src="/hero.png" />

// CORRETO: imagem com alt descritivo
<img src="/hero.png" alt="Dashboard mostrando grafico de vendas do ultimo mes" />

// CORRETO: imagem decorativa (nao precisa de descricao)
<img src="/divider.png" alt="" role="presentation" />
```

## Botoes acessiveis

```tsx
// ERRADO: div clicavel sem semantica
<div onClick={handleClick} className="button">
  Enviar
</div>

// CORRETO: botao semantico
<button onClick={handleClick} type="submit">
  Enviar
</button>

// CORRETO: botao com icone precisa de label
<button onClick={handleDelete} aria-label="Excluir item">
  <TrashIcon />
</button>
```

## Navegacao por teclado

```tsx
// ERRADO: apenas onClick, impossivel usar com teclado
<div onClick={openMenu}>Menu</div>

// CORRETO: botao nativo ja suporta Enter e Space
<button onClick={openMenu}>Menu</button>

// CORRETO: se precisar usar div, adicionar role e keyboard handler
<div
  role="button"
  tabIndex={0}
  onClick={openMenu}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu()
    }
  }}
>
  Menu
</div>
```

## Formularios acessiveis

```tsx
// ERRADO: input sem label
<input type="email" placeholder="Digite seu email" />

// CORRETO: label associado ao input
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="exemplo@email.com" />

// CORRETO: grupo de campos com fieldset
<fieldset>
  <legend>Endereco de entrega</legend>
  <label htmlFor="street">Rua</label>
  <input id="street" type="text" />
  <label htmlFor="city">Cidade</label>
  <input id="city" type="text" />
</fieldset>
```

## Headings semanticos

```tsx
// ERRADO: headings fora de ordem
<h1>Minha Aplicacao</h1>
<h3>Secao de produtos</h3>  {/* pulou h2 */}
<h5>Detalhes do produto</h5>  {/* pulou h4 */}

// CORRETO: hierarquia respeitada
<h1>Minha Aplicacao</h1>
<h2>Secao de produtos</h2>
<h3>Detalhes do produto</h3>
```

## Landmarks semanticos

```tsx
// ERRADO: divs genericas sem semantica
<div className="header">...</div>
<div className="sidebar">...</div>
<div className="content">...</div>
<div className="footer">...</div>

// CORRETO: landmarks HTML5
<header>...</header>
<nav aria-label="Menu principal">...</nav>
<aside aria-label="Filtros">...</aside>
<main>...</main>
<footer>...</footer>
```

## Fontes acessiveis (ajustaveis)

```css
/* ERRADO: tamanho fixo em pixels */
body { font-size: 14px; }
h1 { font-size: 32px; }

/* CORRETO: tamanho relativo em rem */
body { font-size: 1rem; }
h1 { font-size: 2rem; }
```

## Cor nao e unica indicacao

```tsx
// ERRADO: apenas cor indica erro
<input style={{ borderColor: hasError ? 'red' : 'gray' }} />

// CORRETO: cor + icone + texto
<div>
  <input
    style={{ borderColor: hasError ? 'red' : 'gray' }}
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && (
    <span id="email-error" role="alert">
      <WarningIcon /> Email invalido. Use o formato exemplo@email.com
    </span>
  )}
</div>
```