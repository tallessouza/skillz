# Code Examples: CSS Global — Reset e Configurações Globais

## Exemplo 1: Problema sem reset global

```css
/* App.css */
.container {
  background-color: red;
}
```

```tsx
// App.tsx
import './App.css'

export function App() {
  return <div className="container">Conteúdo</div>
}
```

**Resultado visual:** A cor vermelha não preenche toda a viewport. Há uma borda branca ao redor (margin padrão do body do navegador, geralmente 8px).

---

## Exemplo 2: Criando o global.css com reset

```css
/* src/global.css */
* {
  margin: 0;
  padding: 0;
}
```

**O seletor `*`** aplica a regra para TODOS os elementos HTML da página. Isso remove qualquer margin ou padding que o navegador tenha aplicado por padrão.

---

## Exemplo 3: Importação correta no App.tsx

```tsx
// App.tsx
import './global.css'  // PRIMEIRO — reseta tudo
import './App.css'     // DEPOIS — aplica estilos específicos

export function App() {
  return <div className="container">Conteúdo</div>
}
```

**Resultado:** A borda branca desaparece. O background vermelho agora preenche toda a viewport.

---

## Exemplo 4: Adicionando configurações globais (background, fonte)

```css
/* src/global.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #121214;
  color: #e1e1e6;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

Configurações comuns para aplicações com tema escuro, como mostrado no curso. O `box-sizing: border-box` é um reset adicional comum que simplifica cálculos de largura/altura.

---

## Exemplo 5: Importação na ordem ERRADA (anti-pattern)

```tsx
// App.tsx — ERRADO
import './App.css'     // Define estilos específicos
import './global.css'  // Reset DEPOIS → sobrescreve os estilos acima!
```

```css
/* App.css */
body {
  padding: 20px;
}
```

```css
/* global.css */
* {
  margin: 0;
  padding: 0;  /* Vai sobrescrever o padding: 20px do App.css! */
}
```

**Resultado:** O `padding: 20px` definido em `App.css` é sobrescrito pelo reset do `global.css` porque este foi importado por último.

---

## Exemplo 6: Separação global vs. específico

```css
/* src/global.css — Configurações da aplicação inteira */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #121214;
  font-family: 'Inter', sans-serif;
}
```

```css
/* src/pages/Login.css — Específico da tela de login */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-form {
  background-color: #202024;
  padding: 2rem;
  border-radius: 8px;
}
```

```tsx
// src/pages/Login.tsx
import './Login.css'

export function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        {/* campos do formulário */}
      </form>
    </div>
  )
}
```

O `global.css` já foi importado no `App.tsx` uma única vez. Cada página importa apenas seus estilos específicos.

---

## Exemplo 7: Estrutura de arquivos recomendada

```
src/
├── global.css          # Reset + configurações globais
├── App.tsx             # Importa global.css no topo
├── App.css             # Estilos específicos do App
├── main.tsx            # Bootstrap (NÃO importa CSS aqui)
└── pages/
    ├── Home.tsx
    ├── Home.css        # Estilos específicos da Home
    ├── Login.tsx
    └── Login.css       # Estilos específicos do Login
```