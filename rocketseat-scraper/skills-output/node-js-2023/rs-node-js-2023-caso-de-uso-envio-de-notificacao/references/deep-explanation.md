# Deep Explanation: Caso de Uso — Envio de Notificacao

## Por que copiar e adaptar um caso de uso existente?

O instrutor demonstra explicitamente a tecnica de copiar o `createQuestion` use case e adaptar para `sendNotification`. Isso nao e preguica — e consistencia arquitetural. Quando voce copia um caso de uso que ja funciona:

1. **Mantem o mesmo padrao estrutural** — constructor injection, request/response types, execute method
2. **Evita esquecer partes** — o template ja tem tudo que precisa
3. **Acelera drasticamente** — o instrutor comenta que foi "um pouquinho mais rapido porque ja fizemos isso varias vezes"

A chave e o find-and-replace cuidadoso:
- `createQuestion` → `sendNotification` (nome do use case)
- `question` → `notification` (entidade, com preserveCase para manter PascalCase/camelCase)
- `authorId` → `recipientId` (campo semantico diferente)
- Remover o que nao se aplica: `attachments` nao existe em notificacoes

## O problema da classe global `Notification`

O JavaScript tem uma classe global `Notification` (Web Notifications API). Quando voce cria uma classe `Notification` no dominio, o TypeScript nao reclama se voce esquece de importar — ele usa a global silenciosamente. O instrutor mostra que precisa:

1. Apagar o nome
2. Digitar novamente
3. Aceitar o auto-import da classe local

Isso e um gotcha real em projetos DDD que usam nomes comuns como `Notification`, `Event`, `Error`.

## Subdominio de Notificacao como dominio separado

A notificacao vive em `src/domain/notification/`, separado de `src/domain/forum/`. Isso reflete o conceito de **subdominios** em DDD:
- O forum e o dominio principal
- A notificacao e um subdominio de suporte
- Cada um tem suas proprias entidades, repositorios e casos de uso

Eles se comunicam via **Domain Events** (que sera abordado nas proximas aulas), nao via importacao direta.

## Por que o teste e "simples"

O instrutor reconhece que o teste e simples — chama execute e verifica que o item foi persistido. Mas esse e exatamente o ponto:

- Use cases devem ser testados isoladamente
- O repositorio in-memory simula persistencia sem I/O
- O teste verifica o **comportamento** (notificacao foi criada e salva), nao detalhes de implementacao

A complexidade vira nas proximas aulas quando Domain Events conectam subdominios.

## Padrao de adaptacao campo-a-campo

| Campo no Forum (createQuestion) | Campo na Notificacao (sendNotification) |
|--------------------------------|----------------------------------------|
| `authorId` | `recipientId` |
| `title` | `title` |
| `content` | `content` |
| `attachments` | *(removido — nao se aplica)* |

A decisao de **quais campos manter, renomear ou remover** e uma decisao de dominio, nao tecnica.