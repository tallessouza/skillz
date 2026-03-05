# Code Examples: KeyOf

## Exemplo 1: Codigo exato da aula

```typescript
const icons = {
  home: "./path/home.svg",
  add: "./path/add.svg",
  remove: "./path/remove.svg",
}

type Icon = typeof icons

const icon: keyof Icon = "add"
```

Passo a passo:
1. `icons` e um objeto com 3 chaves: `home`, `add`, `remove`
2. `type Icon = typeof icons` cria um tipo que representa a estrutura do objeto
3. `keyof Icon` extrai as chaves como union: `"home" | "add" | "remove"`
4. A variavel `icon` so aceita um desses tres valores

## Exemplo 2: Sem keyof (o que o instrutor mostrou como contraste)

```typescript
type Icon = typeof icons

// Sem keyof, Icon espera o objeto completo:
const icon: Icon = {
  add: "texto",
  home: "texto",
  remove: "texto",
}
```

## Exemplo 3: Funcao com keyof

```typescript
const icons = {
  home: "./path/home.svg",
  add: "./path/add.svg",
  remove: "./path/remove.svg",
}

function renderIcon(name: keyof typeof icons) {
  const path = icons[name]
  return `<img src="${path}" />`
}

renderIcon("home")    // OK
renderIcon("add")     // OK
renderIcon("x")       // ERRO de compilacao
```

## Exemplo 4: Componente React com keyof

```typescript
const icons = {
  home: "./path/home.svg",
  add: "./path/add.svg",
  remove: "./path/remove.svg",
} as const

type IconName = keyof typeof icons

interface IconProps {
  name: IconName
  size?: number
}

function Icon({ name, size = 24 }: IconProps) {
  const path = icons[name]
  return <img src={path} width={size} height={size} />
}

// Uso:
<Icon name="home" />     // OK
<Icon name="delete" />   // ERRO: '"delete"' is not assignable
```

## Exemplo 5: Mapa de rotas

```typescript
const routes = {
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
}

type RouteName = keyof typeof routes

function navigate(route: RouteName) {
  window.location.href = routes[route]
}

navigate("dashboard") // OK
navigate("login")     // ERRO
```

## Exemplo 6: Mapa de temas

```typescript
const themes = {
  light: { bg: "#fff", text: "#000" },
  dark: { bg: "#000", text: "#fff" },
  sepia: { bg: "#f4ecd8", text: "#5b4636" },
}

type ThemeName = keyof typeof themes

function applyTheme(name: ThemeName) {
  const theme = themes[name]
  document.body.style.backgroundColor = theme.bg
  document.body.style.color = theme.text
}
```

## Exemplo 7: keyof com interface (sem typeof)

```typescript
interface User {
  name: string
  email: string
  age: number
}

// keyof direto na interface — nao precisa de typeof
type UserField = keyof User // "name" | "email" | "age"

function getUserField(user: User, field: UserField) {
  return user[field]
}
```