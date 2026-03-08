# Deep Explanation: Feature Branch + Feedback Visual com Animação

## Por que branches semânticas?

O instrutor enfatiza que branches devem seguir o mesmo padrão de **commits semânticos** (conventional commits). Isso não é uma regra fixa universal — cada empresa pode ter seu padrão — mas é amplamente considerado boa prática.

### Prefixos comuns

| Prefixo | Uso |
|---------|-----|
| `feature/` ou `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `refactor/` | Refatoração sem mudar comportamento |
| `style/` | Mudanças visuais/CSS |
| `docs/` | Documentação |
| `chore/` | Tarefas de manutenção |

### Separador após prefixo

O instrutor usa `/` como separador (ex: `feature/shake-feedback`), que é a convenção mais comum porque o Git trata como "pastas" de branches. Dentro do nome, usa `_` ou `-` para separar palavras.

### Fluxo de trabalho com branch

O conceito-chave explicado pelo instrutor:

1. Criar branch separada da `main`
2. Desenvolver a feature nessa branch
3. Enviar para o GitHub (não vai para `main`)
4. Ter uma pré-visualização antes de integrar
5. Tendo tudo certo, juntar com a `main` (merge)
6. Aí sim gera a nova build

Isso evita que código incompleto ou com bugs chegue à branch principal e quebre o deploy.

## Anatomia da animação shake

### Por que keyframes e não transition?

Transitions são para mudanças de estado simples (A → B). Keyframes permitem definir múltiplos pontos intermediários, essencial para o efeito "vai e volta" do shake:

```
0%   → posição 0 (início)
25%  → -10px (esquerda)
50%  → +10px (direita)
75%  → -10px (esquerda)
100% → 0 (volta ao centro)
```

Isso cria um movimento oscilatório: centro → esquerda → direita → esquerda → centro.

### A propriedade `transform: translateX()`

O instrutor usa `translateX` porque o shake é horizontal. Para outros feedbacks:
- `translateY` — shake vertical
- `rotate` — tremor rotacional
- `scale` — pulsação

### `ease-in-out` na animação

O instrutor escolhe `ease-in-out` (0.3s) porque:
- Começa suave (ease-in)
- Termina suave (ease-out)
- 0.3s é rápido o suficiente para parecer responsivo mas lento o suficiente para ser percebido

## Controle de animação via estado React

### O problema: animação executa só uma vez

CSS animations executam quando o elemento recebe a classe. Se a classe já está aplicada, não re-executa. Por isso o padrão é:

1. Adicionar a classe (setState true)
2. Esperar a animação terminar
3. Remover a classe (setState false)
4. Na próxima vez, adicionar de novo → re-executa

### Por que setTimeout e não onAnimationEnd?

O instrutor usa `setTimeout` por simplicidade. Uma alternativa mais robusta seria o evento `onAnimationEnd`:

```tsx
<div
  className={`${styles.word} ${shake ? styles.shake : ''}`}
  onAnimationEnd={() => setShake(false)}
>
```

Porém, `setTimeout` funciona bem para animações simples e é mais direto de entender.

### Sincronização de tempos

O instrutor enfatiza que o `setTimeout` de 300ms deve corresponder à duração da animação CSS de 0.3s. Se estiverem dessincronizados:
- Timeout menor que animação → classe removida antes da animação terminar (corte abrupto)
- Timeout maior que animação → delay desnecessário antes de poder re-triggerar

## Template literals para classes compostas

### O padrão CSS Modules + condição

Quando se usa CSS Modules e precisa compor múltiplas classes:

```tsx
// Uma classe estática + uma condicional
className={`${styles.word} ${shake ? styles.shake : ''}`}
```

O instrutor mostra a progressão:
1. Classe simples: `className={styles.word}`
2. Necessidade de adicionar outra: precisa de template literal
3. Envolver em crase: `` ` `` 
4. Interpolar com `${}` cada classe
5. Usar ternário para condicional

## Fluxo completo da feature

1. `git checkout -b feature/shake-feedback` — cria branch
2. Edita `app.module.css` — adiciona keyframe + classe `.shake`
3. Edita `app.tsx` — adiciona estado `shake` + lógica condicional
4. Testa localmente — verifica que animação só ocorre no erro
5. Commita e envia para o GitHub na branch `feature/shake-feedback`
6. Faz preview/review
7. Merge com `main` → nova build gerada