# Deep Explanation: Selecionando Aula Atual

## Por que indices e nao objetos?

O instrutor explica tres abordagens para rastrear o item ativo no state, eliminando cada uma:

### Abordagem 1: Objeto completo (rejeitada)
```typescript
activeLesson: { id: 'abc', title: 'Intro', duration: '09:13' }
```
**Problema:** Informacao duplicada. O objeto ja existe dentro de `course.modules[x].lessons[y]`. Manter uma copia separada cria risco de dessincronizacao — se o curso muda, o `activeLesson` fica desatualizado.

### Abordagem 2: ID da aula (rejeitada)
```typescript
activeLessonId: 'abc-123'
```
**Problema:** Para recuperar a aula pelo ID, voce precisa iterar com `.find()` sobre o array de lessons. Em estruturas aninhadas (modulos > aulas), isso significa iterar sobre todos os modulos e todas as aulas ate encontrar. Codigo verboso e performance O(n*m).

### Abordagem 3: Indices (escolhida)
```typescript
currentModuleIndex: 0
currentLessonIndex: 0
```
**Vantagem:** Acesso direto O(1) via `modules[i].lessons[j]`. Sem duplicacao. State minimo. O selector faz a composicao.

## Estrategia de dispatch: pai vs filho

O instrutor mostra duas alternativas para o dispatch quando o componente que renderiza o botao (Lesson) nao tem acesso aos indices:

**Alternativa 1:** Passar `moduleIndex` e `lessonIndex` como props para Lesson e fazer dispatch la dentro.

**Alternativa 2 (escolhida):** Passar um callback `onPlay` do componente Module (que tem os indices via `.map()`) para Lesson. Lesson apenas chama `onPlay()` no click.

A alternativa 2 e mais limpa porque Lesson nao precisa conhecer a estrutura do state — ela apenas notifica que foi clicada.

## Redux DevTools como ferramenta de debug

O instrutor destaca que nao precisa de `console.log` para verificar actions — o Redux DevTools mostra o payload de cada action disparada, permitindo verificar que `play([0, 1])` corresponde ao modulo 0, aula 1.

## Reatividade automatica

Quando o reducer atualiza `currentModuleIndex` e `currentLessonIndex`, o componente de video re-renderiza automaticamente porque depende dessas informacoes via `useAppSelector`. O instrutor demonstra clicando nas aulas e vendo o video trocar — sem nenhum codigo adicional de sincronizacao.