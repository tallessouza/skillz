# Deep Explanation: Rota de Aprovar Pedido — Uma Rota por Transicao de Status

## Por que nao uma rota unica de "alterar status"?

O instrutor explica com clareza: "A gente poderia fazer uma rota so que o nome dela e tipo alterar status do pedido. So que e mais facil agora no comeco, mas mais para frente conforme a gente vai precisando adicionar regras de negocios diferentes, comeca a tornar o negocio mais dificil."

O raciocinio e:
- **Agora parece simples** — e so trocar um campo no banco
- **No futuro, cada transicao tem regras diferentes** — aprovar exige status pendente, cancelar nao pode acontecer se ja entregue, etc.
- **Uma rota generica vira um `switch/case` gigante** — com regras de negocio misturadas, dificil de testar e manter

## A ilusao da simplicidade

O instrutor destaca: "Por mais que pareca uma acao simples, porque e so a troca do status no banco de dados, elas vao ter regras de negocio completamente diferentes."

Isso e um insight de design de API que muitos iniciantes perdem. A operacao no banco e identica (`UPDATE SET status = X`), mas a **validacao antes** da operacao e completamente diferente para cada transicao.

## Fluxo de estados do pedido

```
pending → processing (approve)
pending → canceled (cancel)
processing → delivering (dispatch)
processing → canceled (cancel — mas nao se ja saiu pra entrega)
delivering → delivered (deliver)
delivered → (estado final, nenhuma transicao)
```

Cada seta nesse diagrama e uma rota separada, com suas proprias pre-condicoes.

## Pattern: Guard Clause antes da mutacao

O padrao usado pelo instrutor e consistente:
1. Valida parametros (zod no params)
2. Autentica usuario (`getCurrentUser`)
3. Busca o recurso no banco
4. Verifica se recurso existe (404/400)
5. Verifica pre-condicao de status (400)
6. Executa a mutacao

Essa ordem importa: nao faz query ao banco se o usuario nao esta autenticado. Nao tenta mutar se o status nao permite.

## Por que PATCH e nao PUT?

PATCH indica alteracao parcial do recurso. Estamos mudando apenas o campo `status` do pedido, nao substituindo o pedido inteiro. PUT semanticamente significa "substitua o recurso completo", o que nao e o caso.

## Teste manual com Hopscotch

O instrutor usa Hopscotch para testar:
1. Busca um pedido com status `pending` no banco
2. Faz PATCH para `/orders/:id/approve`
3. Verifica o resultado fazendo GET no detalhe do pedido
4. Confirma que o status mudou para `processing`

Erro comum mostrado na aula: esquecer de trocar o ID do pedido ao testar (estava usando o ID de outro pedido). Sempre verifique se o ID que esta testando corresponde a um pedido no status correto.