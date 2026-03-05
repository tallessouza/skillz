# Deep Explanation: API de Tickets de Suporte

## Por que separar PUT e PATCH?

O instrutor faz uma distincao clara entre **atualizar dados** (PUT) e **transicionar estado** (PATCH). Isso nao e apenas convencao REST — e uma decisao de design que previne bugs.

Quando voce coloca `status` no mesmo endpoint de `equipment` e `description`, qualquer chamada de update pode acidentalmente mudar o status do ticket. Separando em `PATCH /tickets/:id/status`, voce garante que fechar um ticket e uma acao intencional e isolada.

A URL `PATCH /tickets/:id/status` funciona como um "botao" dedicado — o cliente sabe exatamente o que acontece ao chamar essa rota.

## Por que username e imutavel?

O instrutor escolhe propositalmente que `username` nao pode ser alterado apos a criacao. A razao pedagogica e praticar restricao de campos no update, mas a razao de negocio e real: em sistemas de suporte, o solicitante original deve ser preservado para rastreabilidade.

Na pratica, isso significa que no handler do PUT, voce simplesmente nao extrai `username` do body:

```typescript
const { equipment, description } = req.body  // username ignorado
```

Isso e mais seguro do que validar se username mudou — simplesmente nao leia o campo.

## Por que UUID ao inves de auto-increment?

O instrutor menciona que vamos "gerar esse tipo de ID de forma automatica". UUIDs sao preferidos em APIs porque:

1. **Nao expoe ordem** — auto-increment revela quantos registros existem
2. **Funciona sem banco centralizado** — pode gerar no servidor sem consultar sequencia
3. **Seguro para URLs** — nao e possivel "adivinhar" IDs validos

## Filtro por query param vs rotas separadas

O instrutor usa `GET /tickets?status=open` ao inves de `GET /tickets/open`. Isso e importante porque:

- Query params sao **opcionais** — sem o param, retorna tudo
- E **extensivel** — amanha voce adiciona `?priority=high` sem criar nova rota
- Segue o padrao REST onde o path identifica o recurso e query params filtram

## Fechar vs Deletar

O instrutor faz questao de diferenciar:

- **Fechar** (`PATCH /tickets/:id/status`): o ticket continua existindo, mas com status "closed". Util para historico e relatorios.
- **Deletar** (`DELETE /tickets/:id`): remove permanentemente o registro. Operacao destrutiva.

Em sistemas reais, deletar tickets e raro — normalmente usa-se soft delete. Mas para fins didaticos, o instrutor implementa ambos para praticar os metodos HTTP.

## Visao do front-end

O instrutor mostra uma referencia visual do front-end com campos: descricao, equipamento, data de criacao e status (aberto/encerrado). Isso contextualiza os campos da API — cada campo no front-end corresponde a um campo retornado pela API.

O front-end NAO e implementado nesta etapa — o foco e 100% back-end com Node.js.

## Estrutura dos dados

```typescript
// Ticket criado via POST
{
  id: string,          // UUID gerado automaticamente
  equipment: string,   // Nome do equipamento (editavel)
  description: string, // Descricao do problema (editavel)
  username: string,    // Quem abriu o ticket (imutavel)
  status: string,      // "open" | "closed" (transicionado via PATCH)
  createdAt: Date      // Quando foi criado (automatico)
}
```