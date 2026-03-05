# Code Examples: Arquitetura do Next.js

## Demonstracao: Disable JavaScript no DevTools

O instrutor demonstra ao vivo que a aplicacao Next.js funciona sem JavaScript no cliente:

```
1. Abrir DevTools (F12 ou Inspecionar Elemento)
2. Clicar na engrenagem (Settings)
3. Marcar "Disable JavaScript"
4. F5 (recarregar pagina)
5. Resultado: interface continua aparecendo normalmente
6. Navegacao entre paginas funciona
7. Apenas funcionalidades reativas (animacoes, eventos JS) param
```

### Teste comparativo

**Em uma aplicacao React pura (CRA/Vite):**
```
Disable JavaScript → F5 → Tela branca total
```
Porque: todo HTML e construido por JavaScript no navegador.

**Em uma aplicacao Next.js:**
```
Disable JavaScript → F5 → Interface aparece normalmente
```
Porque: HTML foi montado pelo servidor Node antes de chegar ao navegador.

## Estrutura conceitual do projeto Next.js

```
next-app/
├── app/                    # Codigo das paginas (App Router)
│   ├── page.tsx           # Pagina raiz (/)
│   └── signin/
│       └── page.tsx       # Pagina /signin
├── package.json
└── ...

# Quando roda `npm run dev`:
# → Sobe servidor Node na porta 3000
# → Este servidor NAO e a API
# → Este servidor e o BFF que monta HTML
```

## Fluxo de requisicao ilustrado em codigo

### SPA Tradicional (React puro)

```html
<!-- index.html servido para QUALQUER rota -->
<!DOCTYPE html>
<html>
<head>
  <!-- CSS global de toda a aplicacao -->
  <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
  <div id="root"></div>
  <!-- Bundle JS de TODA a aplicacao (~5MB) -->
  <script src="/static/js/bundle.js"></script>
</body>
</html>
```

```typescript
// Dentro do bundle.js, depois de carregar:
// 1. React monta toda a arvore de componentes
// 2. Router decide qual pagina mostrar
// 3. Componente da pagina faz fetch para API
useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    // Ate aqui: usuario viu loading spinner ou tela branca
}, [])
```

### Next.js SSR

```typescript
// app/signin/page.tsx — Server Component por padrao
// Este codigo roda NO SERVIDOR, nao no navegador

export default async function SignInPage() {
  // Se precisar de dados, busca no servidor ANTES de montar HTML
  // const users = await fetch('http://api.example.com/users')

  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
  // HTML montado no servidor → enviado pronto ao usuario
  // Usuario ve a pagina IMEDIATAMENTE, sem esperar JS
}
```

## Comparacao de tamanho de payload

```
SPA Tradicional:
  Primeira requisicao → ~5MB (bundle.js completo)
  Contem: TODAS as paginas, TODOS os componentes
  Tempo: depende da conexao (3G = vários segundos de tela branca)

Next.js SSR:
  Primeira requisicao → ~200KB (apenas assets da pagina acessada)
  Contem: APENAS HTML/CSS/JS da pagina /signin
  Tempo: HTML pronto chega quase instantaneamente
```

## Servidor Node do Next.js — o que acontece internamente

```
# Quando usuario acessa localhost:3000/signin:

1. Requisicao HTTP chega no servidor Node (npm run dev)

2. Servidor Node (Next.js):
   → Identifica rota: /signin
   → Encontra: app/signin/page.tsx
   → Importa APENAS dependencias dessa pagina
   → Executa o componente React no Node (Server Component)
   → Se componente faz fetch → executa fetch no servidor
   → Gera HTML string do resultado
   → Envia HTML pronto na resposta HTTP

3. Navegador recebe HTML pronto:
   → Renderiza imediatamente (sem esperar JS)
   → Baixa JS minimo para "hidratar" (tornar interativo)
   → Hydration completa → pagina e totalmente interativa
```