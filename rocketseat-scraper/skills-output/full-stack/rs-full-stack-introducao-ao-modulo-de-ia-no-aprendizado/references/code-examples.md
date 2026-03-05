# Code Examples: IA no Aprendizado em Programação

## Exemplo 1: Uso correto vs incorreto de código gerado por IA

### Cenário: Você pediu para a IA criar uma função de filtro

**Uso incorreto (copiar e colar):**
```typescript
// IA gerou isso, colei no projeto, funciona, próximo...
const filterUsers = (users: User[], role: string) => 
  users.filter(u => u.role === role && u.active)
```

Problemas: Você não sabe por que `u.active` está ali. Não sabe o que acontece se `users` for `undefined`. Não sabe se `===` é a comparação correta para `role`.

**Uso correto (compreender e então usar):**
```typescript
// IA gerou. Antes de usar, eu entendo cada parte:
// - .filter() cria novo array com elementos que passam no teste
// - u.role === role: comparação estrita de string
// - && u.active: só inclui usuários ativos (booleano)
// Pergunta para IA: "E se users for undefined?" 
// Resposta: vai dar erro. Devo adicionar fallback ou validar antes.

const filterActiveUsersByRole = (users: User[], role: string) => 
  users.filter(user => user.role === role && user.active)
```

## Exemplo 2: Usando IA para entender um conceito

### Cenário: Você não entende closures

**Abordagem passiva (leitura):**
- Lê a explicação da IA uma vez
- Acha que entendeu
- Não consegue aplicar depois

**Abordagem ativa (interação):**
```
Você: "Explica closures com um exemplo prático"
IA: [explica com exemplo]
Você: "Agora me dá um exercício para eu fazer sem ajuda"
IA: [dá exercício]
Você: [tenta resolver]
Você: "Fiz assim [código]. Está certo? O que posso melhorar?"
IA: [feedback específico]
```

## Exemplo 3: Debugando com IA de forma que gera aprendizado

**Sem aprendizado:**
```
Você: "Esse código dá erro: [cola erro]. Conserta."
IA: [código consertado]
Você: [cola código consertado, segue em frente]
```

**Com aprendizado:**
```
Você: "Esse código dá erro: [cola erro]. Me explica por que esse erro acontece."
IA: [explica a causa raiz]
Você: "Entendi. Vou tentar consertar sozinho primeiro."
[tenta]
Você: "Consertei assim: [código]. Essa é a melhor abordagem?"
IA: [valida ou sugere melhoria com explicação]
```

## Padrão geral: O ciclo de 4 passos

```
1. GERE   — Peça para a IA gerar/explicar
2. ENTENDA — Leia cada linha, pergunte o que não entender  
3. REPRODUZA — Tente fazer sozinho sem olhar a resposta
4. VALIDE  — Compare sua versão com a da IA, peça feedback
```

Esse ciclo transforma a IA de "geradora de código" em "tutora personalizada".