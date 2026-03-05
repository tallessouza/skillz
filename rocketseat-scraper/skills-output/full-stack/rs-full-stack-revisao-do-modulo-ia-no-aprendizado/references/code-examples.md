# Code Examples: IA no Aprendizado

## Prompts para aprendizado efetivo

### Pedir explicação detalhada de código

```
Selecione a linha de código na IDE, depois use este prompt:

"Explique esta linha de código nos detalhes.
Explique como se fosse para a quinta série.
Explique os princípios fundamentais por trás dela."
```

**Por que funciona:** Cada instrução força a IA a operar em um nível diferente — detalhe técnico, simplicidade, e fundamentos teóricos.

### Tree of Thought para decisões técnicas

```
"Para resolver [problema X], me dê 3 opções: A, B e C.

Para cada opção:
1. Descreva a abordagem
2. Liste os prós
3. Liste os contras

Ao final, recomende qual caminho seguir e por quê."
```

**Variação expandida:**
```
"Para implementar autenticação neste projeto, me dê 3 abordagens.

Para cada abordagem:
- Explique como funciona
- Liste 3 pontos positivos
- Liste 3 pontos negativos
- Dê uma nota de 1 a 10 para complexidade

Ao final, monte uma tabela comparativa."
```

### Modo pergunta vs modo agente

**Modo Pergunta (usar 80% do tempo em aprendizado):**
```
"O que essa função faz?"
"Por que usamos async/await aqui?"
"Qual a diferença entre map e forEach neste contexto?"
"Me explique o fluxo de dados neste componente."
```

**Modo Plano (quando travou):**
```
"Estou travado em [problema]. Gere o código para resolver,
mas me explique cada decisão que você tomou e por quê."
```

Depois: apague partes do código gerado e reescreva manualmente.

## Padrão de estudo com IA — sessão completa

### Passo 1: Ler o código e tentar entender sozinho
```typescript
// Olhe para este código e tente explicar antes de perguntar à IA
const users = await prisma.user.findMany({
  where: { active: true },
  include: { posts: true }
})
```

### Passo 2: Perguntar à IA o que não entendeu
```
"Explique o que 'include: { posts: true }' faz no Prisma.
Explique como se fosse para quinta série.
Dê um exemplo do resultado retornado."
```

### Passo 3: Explicar em voz alta
Fale: "Essa query busca todos os usuários ativos e traz junto os posts de cada um, porque o include faz um join implícito."

### Passo 4: Reescrever
Apague o código e reescreva de memória. Se travar, consulte a explicação da IA.

### Passo 5: Anotar para revisar depois
```markdown
## Prisma - include
- `include` traz relações junto na query
- Equivalente a JOIN no SQL
- Revisar: como fazer include condicional?
```

## Exemplos de contexto para IA

### Bom contexto (resposta precisa)
```
"Estou usando Next.js 14 com App Router e Prisma com PostgreSQL.
Preciso criar uma rota API que retorna usuários paginados.
Meu schema tem: User (id, name, email, createdAt).
Me mostre como implementar com cursor-based pagination."
```

### Contexto ruim (resposta genérica)
```
"Como fazer paginação?"
```

A diferença: arquivos, stack, schema, e objetivo específico formam o contexto que direciona a resposta probabilística para algo útil.

## Documentação com IA

### Pedir que documente seu código
```
"Documente esta função explicando:
1. O que ela faz (resumo de 1 linha)
2. Parâmetros e tipos
3. O que retorna
4. Exemplo de uso
5. Edge cases que ela trata"
```

### Usar para criar notas de estudo
```
"Resuma os conceitos que discutimos nesta conversa em formato de bullet points.
Agrupe por tema.
Para cada conceito, adicione um exemplo de código curto."
```