# Code Examples: Planejamento e Organizacao

## Calculo basico de expectativa

### Cenario 1: Projeto com 4h de video, 1h/dia disponivel

```
Conteudo:           4h em video
Multiplicador:      ×3 (recomendado pelo instrutor)
Horas reais:        12h
Disponibilidade:    1h/dia
Prazo:              12 dias
```

### Cenario 2: Projeto com 4h de video, 2h/dia disponivel

```
Conteudo:           4h em video
Multiplicador:      ×3
Horas reais:        12h
Disponibilidade:    2h/dia
Prazo:              6 dias
```

### Cenario 3: Curso completo com 40h, 1h/dia nos dias uteis

```
Conteudo:           40h em video
Multiplicador:      ×3
Horas reais:        120h
Disponibilidade:    1h/dia × 5 dias/semana = 5h/semana
Prazo:              24 semanas (~6 meses)
```

## Template de plano de estudo em Markdown

```markdown
# Plano de Estudo: [Nome do Projeto/Curso]

## Objetivo
Concluir [X] com pratica aplicada ate [data].

## Calculo de tempo
| Item | Valor |
|------|-------|
| Horas de conteudo | Xh |
| Multiplicador | ×3 |
| Horas reais estimadas | Yh |
| Horas disponiveis/dia | Zh |
| Dias necessarios | Y/Z dias |
| Data estimada de conclusao | DD/MM/AAAA |

## Cronograma semanal
| Dia | Horario | Duracao | Status |
|-----|---------|---------|--------|
| Seg | 21h-22h | 1h | [ ] |
| Ter | 21h-22h | 1h | [ ] |
| Qua | 21h-22h | 1h | [ ] |
| Qui | 21h-22h | 1h | [ ] |
| Sex | 21h-22h | 1h | [ ] |
| Sab | — | — | Descanso |
| Dom | — | — | Descanso |

## Regras
- [ ] Celular no silencioso durante o slot
- [ ] Nao pular dias sem reajustar o cronograma
- [ ] Se precisar faltar, compensar no proximo dia disponivel

## Revisao semanal
- Horas planejadas: __h
- Horas realizadas: __h
- % do objetivo concluido: __%
- Ajuste necessario: sim/nao
```

## Variacao: multiplicador por tipo de conteudo

```
| Tipo de conteudo        | Multiplicador sugerido |
|-------------------------|----------------------|
| HTML/CSS basico         | ×2                   |
| JavaScript fundamentals | ×3                   |
| React/frameworks        | ×3                   |
| Backend/APIs            | ×3-4                 |
| Algoritmos/logica       | ×4-5                 |
| DevOps/infra            | ×3                   |
```

## Exemplo de reajuste (o ciclo iterativo)

```
Plano original:
  12h necessarias, 1h/dia = 12 dias

Apos 5 dias:
  Completou apenas 3h (em vez de 5h planejadas)
  Motivo: algumas aulas precisaram de mais pratica

Reajuste:
  Horas restantes: 12 - 3 = 9h
  Novo ritmo real: 0.6h/dia efetivo
  Novo prazo: 9 / 0.6 = 15 dias restantes
  Ou: aumentar para 1.5h/dia → 6 dias restantes
```