# Deep Explanation: Period Section Component Pattern

## Raciocinio do instrutor

### Por que separar em componentes por periodo?

O instrutor identifica que a tela de agendamentos tem tres blocos visuais distintos — manha, tarde e noite — cada um com icone e estilizacao proprios. Em vez de repetir markup tres vezes, ele cria um componente `PeriodSection` que recebe o periodo como prop e renderiza o bloco correto.

### Pattern de mapeamento por objeto

O instrutor diz: "Nesses cenarios eu costumo fazer assim pra ficar bem escalavel". Ele cria um objeto `periodIcons` com chaves `morning`, `afternoon`, `evening` mapeando para componentes JSX do Lucide React. Isso evita condicionais encadeadas e permite adicionar novos periodos sem modificar logica.

### Faixas de horario definidas

O instrutor define explicitamente:
- **Manha:** 9h as 12h
- **Tarde:** 13h as 18h
- **Noite:** 19h as 21h

Esses ranges sao usados para agrupar os appointments nos periodos corretos.

### Mock data como ponte para o banco

O instrutor cria dados mock com `new Date("2025-08-17T10:00:00")` como passo intermediario antes de integrar com Prisma/Postgres. Ele coloca horarios variados (10h, 11h, 14h, 19h) para ter pelo menos um appointment em cada periodo, facilitando o teste visual.

### Decisao de separar logica do componente

O instrutor decide explicitamente que a logica de agrupamento de appointments por periodo deve ficar numa funcao separada, nao dentro do componente. Ele diz: "Uma forma melhor seria a gente separar isso numa funcao diferente." Isso melhora testabilidade e reuso.

### Estrutura de pastas

O instrutor segue o padrao de pasta por componente:
```
components/
  PeriodSection/
    index.ts          # barrel export
    PeriodSection.tsx  # componente
```

### Estilizacao com design tokens

O instrutor usa classes como `text-accent-blue`, `text-accent-orange`, `text-accent-yellow`, `bg-background-primary`, `text-content-primary`, `text-label-large-size` — todos design tokens customizados, nao cores raw do Tailwind.

### Ajuste do Typography

No inicio da aula, o instrutor corrige um erro: estava usando `small` no text title quando deveria ser `medium` (Paragraph Medium). Isso mostra a importancia de verificar o design system antes de assumir tamanhos.