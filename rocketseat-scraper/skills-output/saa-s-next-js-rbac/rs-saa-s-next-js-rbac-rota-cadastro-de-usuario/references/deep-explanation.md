# Deep Explanation: Rota de Cadastro de Usuario

## Por que um singleton do Prisma?

O instrutor cria o Prisma Client em `lib/prisma.ts` e exporta uma unica instancia. Isso e critico porque cada `new PrismaClient()` abre um pool de conexoes com o banco. Em desenvolvimento com hot reload, multiplas instancias esgotam o limite de conexoes rapidamente.

A opcao `log: ['query']` e adicionada para visibilidade — permite ver exatamente quais queries SQL o Prisma gera, util para debugging e otimizacao.

## Alias de importacao com tsconfig

O instrutor destaca que importacoes relativas profundas (`../../../lib/prisma`) ficam confusas e frageis. A solucao e configurar no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./source/*"]
    }
  }
}
```

Com isso, `@/` aponta para a pasta `source/`, tornando imports limpos e independentes da profundidade do arquivo.

## Validacao pelo Zod (schema do Fastify)

O instrutor destaca um ponto importante: como o Zod ja valida o body da requisicao atraves do schema definido na rota, quando o codigo chega ao handler, os dados ja estao garantidos. O TypeScript inclusive ja infere os tipos corretos ao fazer `const { name, email, password } = request.body`.

Se os dados nao baterem com o schema, o Fastify retorna erro automaticamente ANTES de chegar ao handler. Isso elimina a necessidade de validacao manual dentro da rota.

## bcrypt.js e o conceito de rounds

O instrutor explica que o numero de rounds no bcrypt controla quantas vezes o algoritmo aplica o hash sobre o resultado anterior — "o hash em cima do hash em cima do hash". 

Implicacoes praticas:
- **Mais rounds = mais seguro**, mas exponencialmente mais lento
- **6 rounds** e adequado para desenvolvimento e aplicacoes menores
- Para producao com alto risco de ataque, a documentacao do bcrypt recomenda valores maiores
- O instrutor alerta que rounds muito altos impactam a performance do servidor, pois bcrypt e CPU-intensive e bloqueia o event loop

A escolha do numero ideal depende do perfil da aplicacao: quanto maior e mais visivel, maior a chance de ataques de brute force, entao mais rounds sao necessarios.

## Por que verificar email antes do create?

Embora o banco tenha constraint unique no email, o instrutor opta por verificar com `findUnique` antes. Razoes:
1. **Mensagem de erro controlada** — o erro do Prisma por unique constraint e generico e pode vazar informacoes internas
2. **Status HTTP semantico** — permite retornar 409 (Conflict) em vez de 500 (Internal Server Error)
3. **Experiencia do desenvolvedor** — o fluxo fica explicito e legivel

## Status HTTP corretos

- **201 Created** — usado quando um recurso foi criado com sucesso. O instrutor enfatiza que e o status semanticamente correto, nao 200.
- **400 Bad Request** — o instrutor usa inicialmente para email duplicado, mas o correto semanticamente seria 409 Conflict.

## Teste da rota

O instrutor usa `httpie` para teste rapido da rota e `prisma studio` para verificar visualmente os dados no banco. Destaca que existem varias opcoes de cliente HTTP (Insomnia, Thunder Client, Postman, Hopscotch) e que a escolha e pessoal.

## Campos opcionais na criacao

O instrutor menciona que campos como `avatar` nao sao tratados na criacao de conta — sao funcionalidades separadas. Isso segue o principio de manter cada rota focada em uma unica responsabilidade.