# Deep Explanation: Cache no Next.js

## O que e a camada de cache no front-end

O cache no Next.js evita que uma informacao igual para varios usuarios seja carregada multiplas vezes quando ha muitos acessos simultaneos. E uma camada server-side compartilhada — todos os usuarios que acessam a mesma pagina recebem o dado cacheado.

## Por que separar requisicoes

O instrutor Diego explica o motivo arquitetural: no board app, os cards (issues) sao identicos para todos os usuarios, mas as interacoes (curtidas) mudam por usuario. Essa separacao foi intencional desde o inicio para permitir cache nos cards e busca em tempo real nas interacoes.

A analogia e clara: cache so faz sentido para dados "publicos" da aplicacao. No momento que um dado depende de quem esta logado, ele nao pode ser compartilhado.

## Limitacoes fundamentais

### 1. Somente server-side
Requisicoes em Client Components podem ser cacheadas, mas apenas no navegador daquele usuario especifico. Nao ha compartilhamento. Em termos de otimizacao global, nao muda nada — so melhora para aquele usuario individual.

### 2. Sem headers/cookies
O Next.js ativamente bloqueia o uso de `headers()` ou `cookies()` dentro de funcoes com `useCache`. Se voce tentar, recebe um erro explicito. A razao: seria necessario um cache diferente para cada usuario, o que derrota o proposito de cache compartilhado.

### 3. API em transicao
A nova API de cache (`useCache`, `cacheLife`, `cacheTag`, `updateTag`) ainda requer `cacheComponents: true` no next.config. O Diego menciona que isso sera removido quando a API sair de experimental — mas ja e muito melhor que a API anterior.

## Como o cache funciona internamente

1. Primeira requisicao: funcao executa normalmente, resultado e armazenado
2. Requisicoes subsequentes (dentro do tempo de vida): resultado retornado do cache instantaneamente
3. Apos expiracao (`cacheLife`): proxima requisicao executa a funcao novamente
4. Invalidacao manual (`updateTag`): cache e limpo imediatamente para aquela tag

## O padrao cacheTag + updateTag

O insight mais poderoso da aula: usar `cacheTag` com um ID dinamico (ex: `issue-comments-${issueId}`) permite invalidacao cirurgica. Quando um comentario e criado, apenas o cache daquela issue especifica e invalidado — nao o cache de todas as issues.

Isso cria um fluxo reativo:
1. Usuario cria comentario via server action
2. Server action salva no banco
3. Server action chama `updateTag('issue-comments-123')`
4. Proximo acesso a listagem daquela issue busca dados frescos
5. Resultado: comentario aparece instantaneamente para todos

## Necessidade de Suspense e loading.tsx

Ao habilitar `cacheComponents: true`, o Next.js passa a ser mais estrito com boundaries de loading. O Diego encontrou dois erros:
1. `SearchInput` (use client) sem Suspense — resolucao: envolver com `<Suspense>`
2. Page do board carregando searchParams sem loading — resolucao: criar `loading.tsx` com skeleton/fallback

Toda pagina deve ter um `loading.tsx` com skeleton screen para que o usuario veja feedback enquanto dados sao carregados pela primeira vez (antes de entrar no cache).

## Opcoes do cacheLife

| Valor | Uso tipico |
|-------|-----------|
| `'seconds'` | Dados que mudam muito frequentemente |
| `'minutes'` | Comentarios, listas com atualizacao moderada |
| `'hours'` | Configuracoes, dados semi-estaticos |
| `'days'` | Conteudo editorial |
| `'weeks'` | Dados quase estaticos |
| `'max'` | Raramente usado — cache maximo possivel |

Default sem configurar: 15 minutos.

## Decisao arquitetural: o que cachear

A regra de ouro do Diego: "A chance disso mudar tao frequentemente e pouquissima?" Se sim, cache agressivo. Se o dado muda com frequencia e por usuario, nao cachear server-side.