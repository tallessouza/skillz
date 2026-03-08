---
name: rs-next-js-componente-period-section
description: "Applies the PeriodSection component pattern when building schedule/appointment grid layouts in Next.js. Use when user asks to 'create a schedule view', 'build appointment list', 'show time slots', 'display bookings grid', or 'render period-based data'. Enforces empty state handling, responsive grid columns, and component extraction for repeated row items. Make sure to use this skill whenever building any list/grid that groups items by time period. Not for form inputs, date pickers, or calendar month views."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-agendamento
  tags: [period-section, schedule, grid, empty-state, next-js, tailwind, component]
---

# Componente PeriodSection

> Ao construir secoes que agrupam agendamentos por periodo, sempre trate o estado vazio primeiro, use grid responsivo para tabular dados, e extraia componentes para itens repetidos.

## Rules

1. **Verifique estado vazio antes de renderizar a lista** — `period.appointments.length > 0` como guarda, porque exibir grid vazio confunde o usuario
2. **Exiba mensagem clara no estado vazio** — um simples `<p>` com texto descritivo, sem divs wrapper desnecessarias, porque simplicidade comunica melhor ausencia de dados
3. **Use grid de 2 colunas para horario + paciente** — `grid grid-cols-2` com headers descritivos, porque dados tabulares precisam de estrutura visual clara
4. **Esconda headers no mobile** — `md:hidden` nos labels de coluna, porque em telas pequenas o contexto ja e dado pelo layout
5. **Extraia componente para cada item repetido** — quando o padrao de linha se repete (horario, nome, descricao), crie um componente dedicado (ex: AppointmentCard), porque mantém o PeriodSection limpo e cada linha testavel isoladamente
6. **Deixe wrapper div sem estilizacao quando animacao vira depois** — divs que receberao framer-motion ficam propositalmente simples ate a integracao de animacao, porque adicionar estilos prematuros conflita com motion props

## How to write

### Estrutura basica do PeriodSection

```tsx
function PeriodSection({ period }: { period: Period }) {
  return (
    <div>
      <TimeRange range={period.range} />

      {period.appointments.length > 0 ? (
        <div className="px-5">
          <div className="grid grid-cols-2 md:hidden text-sm text-content-secondary mb-2">
            <span>Horário</span>
            <span>Paciente</span>
          </div>
          {/* Wrapper div intencional sem estilos — recebera animacao */}
          <div>
            {period.appointments.map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} />
            ))}
          </div>
        </div>
      ) : (
        <p>Nenhum agendamento para este período.</p>
      )}
    </div>
  )
}
```

## Example

**Before (tudo inline, sem guarda de estado vazio):**

```tsx
function PeriodSection({ period }) {
  return (
    <div>
      <TimeRange range={period.range} />
      <div>
        {period.appointments.map((apt, i) => (
          <div key={i}>
            <span>{apt.time}</span>
            <span>{apt.petName}</span>
            <span>{apt.service}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**After (com this skill applied):**

```tsx
function PeriodSection({ period }) {
  return (
    <div>
      <TimeRange range={period.range} />

      {period.appointments.length > 0 ? (
        <div className="px-5">
          <div className="grid grid-cols-2 md:hidden text-sm text-content-secondary mb-2">
            <span>Horário</span>
            <span>Paciente</span>
          </div>
          <div>
            {period.appointments.map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} />
            ))}
          </div>
        </div>
      ) : (
        <p>Nenhum agendamento para este período.</p>
      )}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista pode estar vazia | Sempre cheque `.length > 0` e forneca mensagem de estado vazio |
| Dados tabulares com 2+ campos | Use grid com headers de coluna |
| Headers irrelevantes no mobile | Esconda com `md:hidden` |
| Linha da lista tem 3+ elementos | Extraia componente dedicado (ex: AppointmentCard) |
| Div wrapper sera animada depois | Deixe sem classes, adicione motion props na hora certa |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `{appointments.map(...)}` sem checar length | `{appointments.length > 0 ? (...map...) : <EmptyState />}` |
| Div vazia quando nao ha dados | `<p>Nenhum agendamento para este período.</p>` |
| Todo markup do item inline no map | Componente separado: `<AppointmentCard />` |
| Estilos prematuros em wrapper de animacao | Div limpa, estilize quando integrar motion |
| `<table>` para layout responsivo | Grid CSS com `grid-cols-2` |

## Troubleshooting

### Componente nao renderiza ou renderiza vazio
**Symptom:** Componente importado corretamente mas nao aparece na tela
**Cause:** Falta de export default/named, ou props obrigatorias nao passadas
**Fix:** Verificar que o componente tem export correto (default ou named). Checar TypeScript props para garantir que todas as props obrigatorias estao sendo passadas

### Props nao atualizam o componente
**Symptom:** Componente mostra dados antigos mesmo quando props mudam
**Cause:** Componente nao re-renderiza por falta de key unica em listas, ou estado interno sobrescreve props
**Fix:** Adicionar `key` unica em elementos de lista. Se usando estado interno, sincronizar com props via useEffect ou derivar estado das props

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componente-period-section/references/deep-explanation.md) — O instrutor enfatiza que a primeira coisa a fazer ao renderizar uma lista de agendamentos e verifica
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componente-period-section/references/code-examples.md) — // components/PeriodSection.tsx
