# Deep Explanation: Criando Interfaces e Tipagens em Angular

## Por que interfaces no singular?

O instrutor enfatiza um erro muito comum em projetos e empresas: nomear interfaces no plural. A interface `IComment` nao representa "varios comentarios" — ela representa a forma de **um unico comentario**. A colecao e representada pelo array (`IComment[]`), nao pelo nome da interface.

Analogia: voce nao chama o molde de uma forma de bolo de "bolos". O molde faz um bolo por vez. A interface e o molde.

## Por que enum + type (nao enum direto)?

O instrutor explica que tipar diretamente com enum causa fricao:

```typescript
// Problematico: passar valores como parametro fica "chatinho"
function setStatus(status: TaskStatusEnum) { }
setStatus(TaskStatusEnum.TODO) // obrigado a usar o enum

// Melhor: type union permite flexibilidade
function setStatus(status: TaskStatus) { }
setStatus(TaskStatusEnum.TODO) // funciona
```

O type union baseado no enum da o melhor dos dois mundos:
- **Enum:** fonte de verdade centralizada, evita duplicacao de strings
- **Type:** facilidade de uso como parametro e em tipagens

## Por que separar em arquivos?

O instrutor comeca com tudo no service ("pode criar tudo aqui dentro mesmo") mas imediatamente refatora para arquivos separados. A razao: **organizacao escala melhor**. Quando o projeto cresce, ter 15 interfaces num service file torna impossivel encontrar qualquer coisa.

A convencao de pastas:
- `interfaces/` — contratos de objetos
- `enums/` — conjuntos finitos de valores
- `types/` — tipos derivados (unions, intersections, mapped types)

## Por que nao colocar .type no nome do arquivo?

O instrutor menciona explicitamente: "Geralmente no type eu nao coloco nada, nao coloco um ponto type aqui nao." A convencao e:
- `task.interface.ts` — tem sufixo `.interface`
- `task-status.enum.ts` — tem sufixo `.enum`
- `task-status.ts` — **sem** sufixo `.type`

Isso e uma convencao do ecossistema Angular que o instrutor segue.

## Refatoracao futura como motivacao

O argumento principal para centralizar strings de status em enum: "se eu ficar duplicando essa string e futuramente eu precisar mudar ela de 'to-do' para 'todo' sem o tracinho, vai ficar muito mais chatinho de fazer essa refatoracao. Vou ter que buscar em todos os locais."

Centralizar = mudar em um lugar, propagar automaticamente.