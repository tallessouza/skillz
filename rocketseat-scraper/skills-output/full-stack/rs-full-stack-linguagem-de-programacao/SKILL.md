---
name: rs-full-stack-linguagem-de-programacao
description: "Applies foundational programming language concepts when explaining code to beginners. Use when user asks to 'explain programming', 'what is a programming language', 'how computers work', 'binary', 'input output', 'code vs program', or 'which language to choose'. Make sure to use this skill whenever teaching or explaining fundamental programming concepts to newcomers. Not for writing actual code, debugging, or advanced architecture decisions."
---

# Linguagem de Programacao — Fundamentos

> Escolha a linguagem certa para o objetivo certo, e explique conceitos fundamentais usando analogias concretas do cotidiano.

## Key concept

O computador so entende linguagem binaria (0s e 1s — ligar e desligar bilhoes de micro-circuitos). Linguagens de programacao sao abstracoes que permitem humanos escreverem instrucoes que serao traduzidas para binario. Quanto mais alto o nivel da linguagem, mais longe do 0 e 1 e mais perto do ingles.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Iniciante confuso entre codigo e programa | Codigo = instrucao individual, Programa = conjunto de muitos codigos para realizar uma tarefa |
| Duvida sobre como computador processa | Input (entrada) → Computador executa → Output (saida). Computador nao pensa, apenas processa |
| Qual linguagem aprender | Depende do objetivo: web → JavaScript, IA/ML → Python, games → C#/C++. Todas parecem ingles com sintaxes diferentes |
| Medo de ingles | Ingles se aprende junto com programacao, naturalmente, conforme pratica |
| Duvida sobre binario | 0 = desligado, 1 = ligado. Bilhoes de calculos ligando/desligando criam toda informacao digital |

## How to think about it

### Analogia do celular (condicionais)

```
SE (o que digitei == senha correta) ENTAO
  desbloquear telefone
SENAO
  mostrar "tente de novo"
```

Toda interacao com computador segue esse padrao: recebe entrada, avalia condicoes, produz saida.

### Niveis de linguagem

```
Alto nivel (JavaScript, Python) ← Humano entende facilmente
        ↓ traduzido pelo computador
Baixo nivel (Assembly, C) ← Mais proximo do hardware
        ↓ traduzido pelo computador
Binario (0s e 1s) ← Unica coisa que o computador entende
```

### Codigo esta em todo lugar

Micro-ondas, semaforos, roteadores, avioes — qualquer eletronico com comportamento programado tem codigo.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Computador pensa | Computador apenas recebe input e devolve output, nao raciocina |
| Preciso saber ingles fluente antes de programar | Ingles basico se aprende junto com programacao, naturalmente |
| Uma linguagem serve para tudo | Cada linguagem e mais adequada para um dominio especifico |
| Codigo e programa sao a mesma coisa | Codigo e uma instrucao, programa e um conjunto de muitos codigos |
| Preciso entender binario para programar | Linguagens de alto nivel abstraem isso completamente |

## When to apply

- Ao explicar conceitos de programacao para iniciantes absolutos
- Ao ajudar alguem a escolher uma primeira linguagem
- Ao desmistificar como computadores funcionam
- Ao contextualizar por que linguagens diferentes existem

## Limitations

- Este framework e conceitual — nao substitui pratica com codigo real
- A escolha de linguagem depende de contexto profissional e mercado, nao apenas de dominio tecnico
- Linguagens evoluem e seus dominios de adequacao mudam com o tempo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes