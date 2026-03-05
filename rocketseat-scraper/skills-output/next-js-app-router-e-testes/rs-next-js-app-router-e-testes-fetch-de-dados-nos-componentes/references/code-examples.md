# Code Examples: Fetch de Dados nos Server Components

## Exemplo 1: Componente basico sem dados (baseline)

```typescript
// app/page.tsx
export default function Home() {
  return <p>Hello World</p>
}
```

**Tempo de resposta:** ~52ms na aba Network (tipo Document).
Este e o baseline — o servidor Node monta o HTML e devolve rapidamente.

## Exemplo 2: Simulando operacao assincrona lenta

```typescript
// app/page.tsx
export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return <p>Hello World</p>
}
```

**O que muda:**
- O componente agora e `async`
- O `await` faz o servidor Node aguardar 2 segundos antes de enviar o HTML
- **Tempo de resposta:** ~2.08s (2s do await + ~80ms de processamento)
- O usuario nao ve NADA por 2 segundos — nem spinner, nem esqueleto

**Por que o instrutor fez isso:** Para demonstrar visualmente que o servidor realmente aguarda todas as promises resolverem antes de enviar o HTML. E uma prova didatica do modelo mental.

## Exemplo 3: Fetch real para API do GitHub

```typescript
// app/page.tsx
export default async function Home() {
  // Mantido para demonstrar o delay visualmente
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const response = await fetch('https://api.github.com/users/diego3g')
  const user = await response.json()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
```

**Observacoes do instrutor:**
- O `setTimeout` foi mantido propositalmente porque o fetch do GitHub e muito rapido e nao daria para perceber o delay
- `JSON.stringify(user, null, 2)` com o `null, 2` formata o JSON com indentacao
- Usa `<pre>` ao inves de `<p>` para fonte monoespassada (melhor visualizacao de JSON)

**Tempo de resposta:** ~2.07s (2s artificiais + fetch rapido + processamento)

## Exemplo 4: Prova de server-side rendering

O instrutor demonstra desabilitando JavaScript no browser:

1. Abre DevTools > Settings (engrenagem)
2. Marca "Disable JavaScript"
3. Da F5 na pagina
4. **Resultado:** Os dados do GitHub CONTINUAM aparecendo

**Por que funciona sem JavaScript:** O fetch acontece no servidor Node. O HTML chega pronto com os dados embutidos. JavaScript no browser nao e necessario para exibir os dados iniciais.

## Exemplo 5: Padrao recomendado para producao (inferido da aula)

```typescript
// app/users/[username]/page.tsx
interface GitHubUser {
  login: string
  name: string
  bio: string
  public_repos: number
  followers: number
}

export default async function UserProfile({
  params,
}: {
  params: { username: string }
}) {
  const response = await fetch(
    `https://api.github.com/users/${params.username}`
  )
  const user: GitHubUser = await response.json()

  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <p>{user.public_repos} repositorios publicos</p>
      <p>{user.followers} seguidores</p>
    </main>
  )
}
```

**Diferencas do exemplo da aula:**
- Sem o `setTimeout` artificial (producao nao precisa)
- Com tipagem TypeScript
- Usando params dinamicos (caso de uso real)
- Renderizando dados estruturados ao inves de JSON bruto

## Comparacao visual: Network tab

```
SEM await (Hello World):
|--52ms--|> HTML entregue

COM await 2s + fetch:
|--------2.07s--------|> HTML entregue (com dados)

SPA tradicional:
|--50ms--|> HTML vazio entregue
          |----500ms----|> JS carrega
                         |---200ms---|> Fetch completa, React renderiza
```

A diferenca fundamental: no Server Component o usuario espera mais para o primeiro byte, mas recebe TUDO de uma vez. Na SPA, recebe rapido mas incompleto.