# Code Examples: Aprendizado na Prática

## Contexto

Esta aula é conceitual — não contém exemplos de código. Porém, as técnicas podem ser aplicadas diretamente ao contexto de programação. Abaixo, exemplos práticos de como cada técnica se manifesta no dia a dia de um dev.

## Técnica 1: Gravar vídeo explicando código

**Cenário:** Você acabou de aprender sobre `Array.reduce()` em JavaScript.

**Suas anotações durante a aula:**
```
- reduce() percorre o array acumulando um valor
- Recebe callback com (acumulador, itemAtual)
- Segundo parâmetro do reduce é o valor inicial
- Pergunta: quando usar reduce vs forEach?
```

**Roteiro derivado das anotações:**
```
1. O que é reduce?
2. Como funciona o acumulador?
3. Exemplo prático: somar preços de produtos
4. Quando usar reduce vs forEach?
```

**Código que você mostraria no vídeo:**
```javascript
// Somar preços de um carrinho de compras
const cartItems = [
  { name: 'Camiseta', priceInCents: 4990 },
  { name: 'Calça', priceInCents: 12990 },
  { name: 'Tênis', priceInCents: 29990 },
]

const totalInCents = cartItems.reduce((accumulator, item) => {
  return accumulator + item.priceInCents
}, 0)

console.log(`Total: R$ ${(totalInCents / 100).toFixed(2)}`)
// Total: R$ 479.70
```

## Técnica 2: Áudio com questionamentos

**Cenário:** Você estudou Promises em JavaScript.

**Script mental para gravar:**
```
"Hoje estudei Promises. O conceito principal é que uma Promise 
representa um valor que pode estar disponível agora, no futuro 
ou nunca. Ela tem três estados: pending, fulfilled e rejected.

Minha dúvida: qual a diferença prática entre usar .then().catch() 
e async/await com try/catch? Ambos fazem a mesma coisa, mas 
async/await parece mais legível. Será que tem algum caso onde 
.then() é melhor?"
```

## Técnica 3: Artigo sobre um conceito

**Cenário:** Você aprendeu sobre o ciclo de vida de componentes React.

**Estrutura do artigo:**
```markdown
# Ciclo de Vida de Componentes React

## O que é?
Todo componente React passa por 3 fases: montagem, atualização 
e desmontagem.

## Como funciona com Hooks?
- useEffect(() => {}, []) → montagem
- useEffect(() => {}, [dep]) → atualização quando dep muda
- useEffect(() => { return () => cleanup }, []) → desmontagem

## Exemplo prático
[código aqui]

## O que me confundiu
A ordem de execução quando existem múltiplos useEffect 
no mesmo componente.
```

## Técnica 4: Debate em comunidade

**Cenário:** Você viu que existem várias formas de estilizar componentes React.

**Post para fórum/Discord:**
```
Estou estudando estilização no React e vi 4 abordagens:
1. CSS Modules
2. Styled Components
3. Tailwind CSS
4. CSS inline

Meu entendimento até agora:
- CSS Modules: escopo local, sem runtime
- Styled Components: CSS-in-JS, dinâmico mas com runtime
- Tailwind: utility-first, rápido mas verboso no JSX
- Inline: só para estilos dinâmicos simples

Alguém que trabalha com projetos grandes pode compartilhar 
qual abordagem funciona melhor em produção e por quê?
```

## Técnica 5: Resolver desafio

**Cenário:** Desafio de implementar uma função de busca.

**Desafio:**
```
Dado um array de objetos de usuários, implemente uma função 
que busque por nome (case-insensitive, match parcial) e 
retorne os resultados ordenados por relevância.
```

**Sua solução prática:**
```javascript
function searchUsers(users, query) {
  const normalizedQuery = query.toLowerCase()

  const matchingUsers = users.filter(user =>
    user.name.toLowerCase().includes(normalizedQuery)
  )

  const sortedByRelevance = matchingUsers.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    const startsWithA = nameA.startsWith(normalizedQuery)
    const startsWithB = nameB.startsWith(normalizedQuery)

    if (startsWithA && !startsWithB) return -1
    if (!startsWithA && startsWithB) return 1

    return nameA.localeCompare(nameB)
  })

  return sortedByRelevance
}
```

## Combinando técnicas

O aprendizado mais efetivo combina múltiplas técnicas para o mesmo conceito:

```
1. Assiste aula sobre Promises → anota perguntas
2. Grava áudio de 3min explicando o conceito
3. Resolve desafio: implementar fetch com retry
4. Escreve artigo curto sobre o que aprendeu
5. Posta dúvida remanescente no fórum
6. 2 meses depois, ouve o áudio e percebe evolução
```

Cada etapa reforça o aprendizado por um canal diferente (verbal, escrito, prático, social, metacognitivo).