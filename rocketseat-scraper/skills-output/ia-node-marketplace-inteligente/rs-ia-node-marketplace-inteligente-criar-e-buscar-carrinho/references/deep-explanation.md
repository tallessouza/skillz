# Deep Explanation: Criar e Buscar Carrinho

## Por que rodar testes em serie?

O instrutor explica que testes que fazem mutacoes no banco de dados (INSERT, UPDATE, DELETE) podem ter conflitos quando rodam em paralelo (comportamento padrao do Jest). Dois testes podem tentar criar registros simultaneamente e interferir um no outro. O `--runInBand` forca execucao sequencial, garantindo que cada teste roda com o estado correto do banco.

## Estrategia de simplificacao: userId hardcoded

Uma decisao pragmatica importante: em vez de implementar todo o fluxo de autenticacao (criacao de usuario, login, JWT, middleware de auth), o instrutor fixa o userId do usuario criado no seed. Isso permite focar no que importa — a logica do carrinho — sem adicionar complexidade desnecessaria.

No NestJS real, o userId viria do request (ex: `@Req() req` apos passar pelo auth guard). O controller e o lugar natural para extrair essa informacao, entao o hardcode fica ali mesmo.

## Padrao de busca: carrinho ativo do usuario

A query de busca filtra por `user_id = $1 AND active = true`. Isso implica que:
- Um usuario pode ter multiplos carrinhos (historico)
- Apenas um esta ativo por vez
- O `active` boolean controla o ciclo de vida do carrinho

O retorno usa `result.rows[0] ?? null` — pega o primeiro resultado ou null. Isso e mais seguro que acessar `rows[0]` direto, que retornaria `undefined`.

## Validacao simples vs Pipes

O instrutor menciona que o NestJS tem `ValidationPipe` com class-validator para validacao robusta, mas opta por validacao manual no controller por simplicidade. Reconhece que pipes seriam o ideal para producao.

## Problema com alias de import nos testes

O ambiente de testes do Jest pode nao reconhecer alias de path como `@/` configurados no tsconfig. A solucao pragmatica e usar caminhos relativos nos arquivos de teste. A configuracao correta seria no `moduleNameMapper` do jest config, mas o instrutor prioriza o progresso sobre a configuracao perfeita.

## Fluxo TDD demonstrado

1. Escrever teste que descreve o comportamento desejado
2. Rodar teste — falha porque rota nao existe
3. Criar modulo/controller/service minimos
4. Rodar teste — falha porque nao retorna dados corretos
5. Implementar logica real
6. Rodar teste — passa
7. Adicionar mais verificacoes no mesmo teste (GET apos POST)
8. Rodar teste — falha porque GET nao existe
9. Implementar GET
10. Continuar ciclo

## Decisao: NotFoundException vs BadRequestException

Quando o carrinho nao e encontrado na busca, o correto e retornar 404 (NotFoundException), nao 400 (BadRequestException). O 400 e para quando o request do cliente esta malformado. O 404 e para quando o recurso solicitado nao existe. O instrutor faz essa distincao explicitamente.