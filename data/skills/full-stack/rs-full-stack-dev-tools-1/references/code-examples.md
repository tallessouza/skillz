# Code Examples: Browser DevTools

## Exemplos do Console mencionados na aula

### Operacoes aritmeticas
```javascript
// Testado diretamente no Console do DevTools
1 + 1
// Output: 2
```

### Concatenacao de strings
```javascript
"Hello" + " Mike"
// Output: "Hello Mike"
```

## Exemplos praticos adicionais no Console

### Selecionar elementos
```javascript
// Selecionar por tag
document.querySelector('h1')

// Selecionar por classe
document.querySelector('.menu')

// Selecionar por ID
document.getElementById('header')

// Atalho do DevTools (equivalente a querySelector)
$('h1')

// Selecionar todos os links
$$('a')  // Retorna array de todos os <a>
```

### Inspecionar estilos via Console
```javascript
// Ver estilos computados de um elemento
const el = document.querySelector('h1')
const styles = getComputedStyle(el)
styles.fontSize    // "32px"
styles.color       // "rgb(0, 0, 0)"
styles.marginTop   // "0px"
```

### Testar manipulacao DOM
```javascript
// Mudar texto (temporario, some ao recarregar)
document.querySelector('h1').textContent = 'Teste'

// Mudar cor
document.querySelector('h1').style.color = 'red'

// Adicionar classe
document.querySelector('h1').classList.add('destaque')
```

### Inspecionar Box Model via Console
```javascript
const el = document.querySelector('.container')
const rect = el.getBoundingClientRect()
console.log(`Width: ${rect.width}, Height: ${rect.height}`)
console.log(`Top: ${rect.top}, Left: ${rect.left}`)
```

## Usando o Elements Panel

### Editar HTML inline
1. Abrir DevTools (`F12`)
2. Na aba Elements, encontrar o elemento
3. Duplo clique no texto para editar
4. `Enter` para confirmar (mudanca temporaria)

### Editar CSS inline
1. Selecionar elemento no Elements
2. No painel Styles (direita), clicar no valor
3. Digitar novo valor
4. Ver mudanca em tempo real

### Adicionar nova regra CSS
1. Selecionar elemento
2. No painel Styles, clicar no `+` (New Style Rule)
3. Escrever seletor e propriedades

### Forcar estados (:hover, :active, :focus)
1. Selecionar elemento
2. No painel Styles, clicar em `:hov`
3. Marcar o estado desejado
4. Ver estilos daquele estado

## Atalhos uteis do DevTools

| Acao | Windows/Linux | Mac |
|------|--------------|-----|
| Abrir DevTools | `F12` ou `Ctrl+Shift+I` | `Cmd+Option+I` |
| Inspect Tool | `Ctrl+Shift+C` | `Cmd+Shift+C` |
| Console direto | `Ctrl+Shift+J` | `Cmd+Option+J` |
| Responsividade | `Ctrl+Shift+M` | `Cmd+Shift+M` |
| Buscar no DOM | `Ctrl+F` (dentro do Elements) | `Cmd+F` |
| Limpar Console | `Ctrl+L` | `Cmd+K` |