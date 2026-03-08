# Deep Explanation: Configurando Variáveis de Ambiente com Zod

## Por que variáveis de ambiente existem

Variáveis de ambiente separam **configuração** de **código**. Isso é um dos princípios do [12-Factor App](https://12factor.net/config). A ideia central: o mesmo código roda em desenvolvimento, staging e produção — o que muda são as variáveis de ambiente.

## O fluxo do .env no dia a dia

O instrutor faz questão de mostrar que o projeto **não vem com `.env`** quando clonado do GitHub. Isso é proposital e reflete o dia a dia real:

1. Você clona um projeto
2. Não existe `.env` (está no `.gitignore`)
3. Você encontra o `.env-example` que lista as variáveis necessárias
4. Duplica `.env-example` → `.env`
5. Preenche com seus valores locais

O `.env-example` funciona como **documentação viva** das variáveis que o projeto precisa. Sem ele, o desenvolvedor teria que caçar no código quais variáveis são necessárias.

## Por que o `.env` fica no .gitignore

O arquivo `.env` contém informações sensíveis:
- **DATABASE_URL** — dá acesso direto ao banco de dados
- **JWT_SECRET** — permite forjar tokens de autenticação
- **API keys** — acesso a serviços pagos

Se alguém acessa seu repositório (mesmo que privado), essas credenciais ficam expostas no histórico do Git para sempre. Mesmo que você delete o arquivo depois, o histórico preserva.

## O papel do Zod na validação de env

O Zod não é apenas "tipagem" — ele é **validação em runtime**. Quando a aplicação inicia:

1. `envSchema.parse(process.env)` executa
2. Se `DATABASE_URL` estiver ausente → **erro imediato** com mensagem clara
3. Se `PORT` estiver ausente → usa o default `3333`
4. Se `PORT` for uma string como `"3000"` → `z.coerce.number()` converte para `3000`

Sem Zod, você descobriria a variável faltando apenas quando o código tentasse usá-la — possivelmente minutos depois, com um erro críptico.

## O comportamento sutil do .env vazio vs ausente

O instrutor demonstra um comportamento importante:

- `PORT=3000` no `.env` → porta 3000
- `PORT=` no `.env` (vazio) → porta 0 (string vazia convertida para 0)
- Sem a linha `PORT` no `.env` → porta 3333 (default do Zod)

Isso acontece porque `z.coerce.number()` converte string vazia `""` para `0`. O `.default(3333)` só se aplica quando a variável é `undefined` (não existe), não quando é string vazia.

**Lição prática:** Se não quer usar uma variável, remova a linha inteira do `.env`. Não deixe `PORT=` sem valor.

## Por que a porta precisa ser variável de ambiente

No ambiente de deploy (Render, Railway, Fly.io, etc.), a plataforma define a porta em que sua aplicação deve escutar. Se a porta estiver hardcoded como `3333`, a aplicação não consegue se adaptar ao ambiente do provedor.

Com `PORT` como variável de ambiente:
- **Desenvolvimento local:** usa o default 3333
- **Deploy:** a plataforma define `PORT=10000` (ou qualquer outra) e a aplicação se adapta automaticamente

## z.coerce.number() vs Number() vs parseInt()

O `z.coerce.number()` do Zod é preferível porque:
- Faz parte do schema de validação (uma única fonte de verdade)
- Lança erro tipado se a conversão falhar de forma inesperada
- Integra-se com o restante das validações do schema

Alternativas manuais como `Number(process.env.PORT)` ou `parseInt(process.env.PORT)` funcionam, mas ficam espalhadas pelo código e não participam da validação centralizada.