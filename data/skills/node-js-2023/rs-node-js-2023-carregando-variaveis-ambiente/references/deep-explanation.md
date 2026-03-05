# Deep Explanation: Carregando Variáveis Ambiente

## Por que validar no boot?

O instrutor enfatiza um princípio fundamental: **se uma variável obrigatória está faltando, a aplicação não deve nem iniciar**. O exemplo clássico é `DATABASE_URL` — não faz sentido a aplicação subir, receber requests, e só falhar quando tentar conectar no banco. O erro deve ser imediato e explícito.

O `throw new Error()` no top-level (fora de qualquer função) derruba a aplicação inteira. Isso é intencional — é melhor crashar no deploy do que servir erros 500 para usuários.

## Por que `safeParse` e não `parse`?

O `parse` do Zod lança uma exceção diretamente. O `safeParse` retorna um objeto `{ success: boolean, data?, error? }`. A vantagem é que com `safeParse` você pode:

1. Checar `success === false`
2. Formatar o erro com `error.format()` para uma saída legível
3. Logar com `console.error` antes de crashar
4. Então dar o `throw`

Isso dá controle sobre a mensagem de erro que o dev vai ver no terminal.

## O papel do `z.coerce`

Tudo que vem do `.env` é string. Se `PORT=3333` está no arquivo, `process.env.PORT` é `"3333"` (string). O `z.coerce.number()` faz a conversão automática — é o equivalente a `Number(value)` mas integrado na validação.

Sem coerce, você teria que fazer `z.string().transform(Number)` ou converter manualmente em outro lugar do código.

## `.env` vs `.env.example`

- **`.env`**: valores reais, vai no `.gitignore`, nunca commitado (pode ter secrets)
- **`.env.example`**: template com as variáveis necessárias, commitado no repositório

Workflow de quem clona o projeto:
```bash
cp .env.example .env
# editar .env com seus valores
```

## O padrão de exportar `env` tipado

Ao exportar `env` (que é `_env.data`), todo o resto da aplicação importa desse módulo e ganha:
- Autocomplete (TypeScript sabe que `env.PORT` é `number`)
- Garantia de que os valores existem (validação já passou)
- Ponto único de acesso (não precisa lembrar o nome exato da variável em `process.env`)

## `z.enum` para NODE_ENV

O `z.enum(['dev', 'test', 'production'])` garante que `NODE_ENV` só pode ser um desses três valores. Se alguém setar `NODE_ENV=staging` e o schema não prevê, a validação falha. O `.default('dev')` faz com que, se não informado, assuma `dev`.