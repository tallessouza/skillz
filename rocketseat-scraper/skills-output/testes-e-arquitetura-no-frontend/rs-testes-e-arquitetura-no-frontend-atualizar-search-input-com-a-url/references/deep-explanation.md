# Deep Explanation: Search Input Sincronizado com URL

## Por que startTransition?

O instrutor explica que, por padrao, o React trata acoes provenientes de input do usuario como prioridade alta. Quando o usuario digita em um input, o React entende que precisa processar aquilo com urgencia. Porem, a atualizacao da URL via `router.push` nao e algo que precisa acontecer com prioridade zero — e uma consequencia secundaria da digitacao.

O `startTransition` e uma API do React que permite marcar atualizacoes de estado como "nao-urgentes" ou "transicoes". Isso informa ao React: "essa parte aqui nao e uma atualizacao urgente, pode fazer quando tiver tempo."

### O problema sem startTransition

Sem startTransition, a cada caractere digitado:
1. O estado do input atualiza (urgente — correto)
2. O router.push dispara (tratado como urgente — incorreto)
3. O React tenta processar tudo com a mesma prioridade
4. Conforme a lista de resultados cresce, isso causa gargalos visiveis

O instrutor mostra na pratica: "Olha so que loucura que ele ta ali" — referindo-se ao comportamento erratico de atualizacao sem a otimizacao.

### O que startTransition resolve

Ao envolver o `router.push` em `startTransition`:
- O React sabe que a navegacao pode esperar
- A digitacao do usuario continua fluida
- As atualizacoes de URL acontecem "quando der"
- Nao ha bloqueio de renderizacao

### Quando o impacto e mais visivel

O instrutor destaca: "Aqui a gente nao esta tendo problema ainda porque a gente nao esta renderizando a nossa lista. Quando a gente tiver uma lista, e cada vez que essa lista crescer mais, a gente vai comecar a notar alguns gargalos."

Ou seja, startTransition e um investimento preventivo — o beneficio cresce conforme a aplicacao escala.

## Abordagem TDD do instrutor

O instrutor segue rigorosamente o ciclo TDD:

1. **Identifica que o comportamento nao pertence aos describes existentes** — nao e base, nao e colapsar, nao e novo prompt
2. **Cria um novo describe "busca"** com o test case antes de implementar
3. **O teste quebra** (red) — "Era o que a gente esperava"
4. **Implementa o minimo** para fazer passar (green)
5. **Descobre bug no teste** (faltava `?` na expectativa) e corrige
6. **Refatora** adicionando startTransition

## Encoding de URL

O instrutor escolhe deliberadamente o texto "a b" (com espaco) para o teste, explicando: "eu quero que ele seja codificado. Quando tiver espaco, eu quero validar isso tambem." O espaco vira `%20` na URL, e isso e validado explicitamente no teste.

Isso garante que a URL e segura para compartilhamento — um dos objetivos declarados: "ele conseguir compartilhar essa URL."

## Decisao: scroll false

O `{ scroll: false }` no router.push evita que a pagina role para o topo a cada atualizacao de URL. Como o usuario esta digitando, qualquer scroll seria uma experiencia terrivel.

## Validacao do teste: lastCall pattern

O instrutor usa `pushMock.mock.calls.at(-1)` para pegar a ultima chamada do mock. Isso e importante porque, ao digitar "a b", o mock e chamado multiplas vezes (uma por caractere). So a ultima chamada importa para validar o resultado final.