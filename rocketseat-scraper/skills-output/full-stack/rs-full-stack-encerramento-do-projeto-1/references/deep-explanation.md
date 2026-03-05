# Deep Explanation: Fundamentos Pre-Framework (Hair Day)

## Filosofia do instrutor

O instrutor Rodrigo enfatiza um ponto crucial: **"Fazer do mais zero possivel para voce ver como as coisas acontecem nos bastidores."** A ideia nao e que voce va configurar webpack manualmente em projetos reais — e que quando o framework fizer isso por voce, voce entenda o que esta acontecendo.

## Por que construir sem framework primeiro?

A analogia implicita e clara: voce nao aprende a dirigir em um carro autonomo. Quando voce configura webpack, cria modulos, renderiza listas manualmente e gerencia estado sem reatividade, voce constroi o modelo mental que frameworks pressupoe.

Quando o instrutor diz "voce vai ver essas coisas la tambem e tudo vai fazer sentido", ele esta dizendo que:
1. **Webpack** → Vite/Turbopack fazem o mesmo, so que pre-configurado
2. **Modulos JS** → Components em React sao modulos com JSX
3. **Re-render manual** → useState + useEffect fazem isso reativamente
4. **Manipulacao de DOM** → Virtual DOM abstrai isso

## Funcionalidades implementadas no Hair Day

O projeto e um sistema de agendamento de corte de cabelo com:

1. **Selecao de data** — Clicar em uma data atualiza a lista de agendamentos
2. **Horarios dinamicos** — Carregados baseado no horario de funcionamento do salao
3. **Bloqueio de slots** — Horarios ja agendados ficam indisponiveis na selecao
4. **Agrupamento por sessao** — Agendamentos organizados por periodo (manha, tarde, noite)
5. **Agendamento (Create)** — Formulario com nome + horario, com feedback de sucesso
6. **Cancelamento (Delete)** — Com confirmacao antes de executar
7. **Atualizacao automatica** — Apos agendar ou cancelar, a lista e os slots se atualizam

## Insight sobre sessoes

O agrupamento por sessoes (manha/tarde/noite) e um pattern de UX que o instrutor destaca como "muito legal". Na pratica, isso significa:
- Classificar horarios em faixas (ex: 08-12 manha, 12-18 tarde, 18-21 noite)
- Renderizar headers de secao dinamicamente
- So mostrar secoes que tem agendamentos

## O ciclo completo de CRUD vanilla

O fluxo que o instrutor demonstra:
1. Selecionar data → Fetch agendamentos daquela data
2. Ver horarios disponiveis → Filtrados pelos ja ocupados
3. Preencher nome + selecionar horario → POST para API
4. Ver agendamento aparecer na lista → Re-render
5. Cancelar agendamento → DELETE com confirm() → Re-render
6. Ver horario liberado novamente → Estado consistente

Este ciclo e exatamente o que frameworks fazem com reatividade, mas aqui voce orquestra cada passo manualmente.