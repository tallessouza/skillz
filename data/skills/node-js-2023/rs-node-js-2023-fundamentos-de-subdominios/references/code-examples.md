# Code Examples: Fundamentos de Subdomínios

## Classificação de subdomínios — E-commerce

O instrutor construiu a seguinte classificação durante a aula:

```
E-COMMERCE
├── CORE (o que dá dinheiro, não pode parar)
│   ├── Compra
│   ├── Catálogo
│   ├── Pagamento
│   └── Entrega
│
├── SUPPORTING (dá suporte ao core)
│   ├── Estoque (suporta Catálogo e Compra)
│   └── Faturamento
│
└── GENERIC (facilmente substituível)
    ├── Notificações ao cliente
    ├── Promoções
    └── Chat de atendimento
```

## Classificação de subdomínios — Fórum (caso do curso)

```
FÓRUM
├── CORE
│   ├── Perguntas (criar tópicos)
│   ├── Respostas (responder tópicos)
│   └── Melhor resposta (escolher melhor resposta)
│
├── SUPPORTING (ou GENERIC, depende do stakeholder)
│   └── Notificações
│       ├── Alguém respondeu meu tópico
│       ├── Minha resposta foi escolhida como melhor
│       └── Alguém comentou na minha pergunta/resposta
```

## Comunicação entre subdomínios — Pattern errado vs correto

### ERRADO: Dependência direta entre subdomínios

```typescript
// src/domain/compra/use-cases/realizar-compra.ts
import { gerarNotaFiscal } from '../../faturamento/services/gerar-nota-fiscal'

export class RealizarCompraUseCase {
  async execute(dados: RealizarCompraDTO) {
    const compra = Compra.criar(dados)
    
    // PROBLEMA: se eu deletar o subdomínio de faturamento,
    // o subdomínio de compra QUEBRA
    await gerarNotaFiscal(compra)
    
    return compra
  }
}
```

### CORRETO: Domain events (desacoplamento de código)

```typescript
// src/domain/compra/use-cases/realizar-compra.ts
// Nenhum import do subdomínio de faturamento!

export class RealizarCompraUseCase {
  async execute(dados: RealizarCompraDTO) {
    const compra = Compra.criar(dados)
    
    // Emite um evento — não sabe nem se alguém está escutando
    compra.addDomainEvent(new CompraRealizada(compra))
    
    return compra
  }
}

// src/domain/faturamento/subscribers/on-compra-realizada.ts
// O subdomínio de faturamento ESCUTA o evento
export class OnCompraRealizada implements EventHandler {
  handle(event: CompraRealizada) {
    // Gera nota fiscal baseado no evento
    this.gerarNotaFiscalUseCase.execute({
      compraId: event.compra.id,
      valor: event.compra.valor,
    })
  }
}
```

### Por que isso funciona no monolito

```
Mesmo processo Node.js
├── Subdomínio de Compra
│   └── Emite: CompraRealizada (domain event)
│
├── Event Dispatcher (síncrono, mesmo processo)
│
└── Subdomínio de Faturamento
    └── Escuta: CompraRealizada → gera nota fiscal

Sem Kafka. Sem RabbitMQ. Sem HTTP entre serviços.
Comunicação síncrona, mas SEM dependência de código.
```

## Cenários de notificação no fórum (caso prático)

```typescript
// Eventos que o subdomínio de fórum emite:
class RespostaEnviada implements DomainEvent {
  constructor(
    public readonly topicoId: string,
    public readonly autorDoTopicoId: string,
    public readonly respostaId: string,
  ) {}
}

class MelhorRespostaEscolhida implements DomainEvent {
  constructor(
    public readonly respostaId: string,
    public readonly autorDaRespostaId: string,
  ) {}
}

// O subdomínio de notificações escuta esses eventos:
class OnRespostaEnviada implements EventHandler {
  handle(event: RespostaEnviada) {
    // Notifica o autor do tópico que alguém respondeu
    this.enviarNotificacaoUseCase.execute({
      destinatarioId: event.autorDoTopicoId,
      titulo: 'Nova resposta no seu tópico',
    })
  }
}
```

## Template de classificação para novos projetos

```markdown
# Subdomínios — [Nome do Projeto]

## Core (não pode parar, diferencial competitivo)
- [ ] ...

## Supporting (suporta o core)
- [ ] ...

## Generic (terceirizável)
- [ ] ...

## Decisões de classificação
| Subdomínio | Classificação | Justificativa do stakeholder |
|------------|---------------|------------------------------|
| ... | Core/Supporting/Generic | "..." |
```