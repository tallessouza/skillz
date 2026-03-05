# Code Examples: Gerar Então Explicar

## Cenario completo: Todo App com JavaScript

### Passo 1: IA gera o codigo (150 linhas)

```javascript
// A IA gerou algo como isso no agent mode:
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function addTodo(text) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push({ id: Date.now(), text, completed: false });
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

function toggleTodo(id) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todoList.innerHTML = todos.map(todo => `
    <li class="${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id})">
      ${todo.text}
    </li>
  `).join('');
}

renderTodos();
```

### Passo 2: Abrir novo chat e pedir explicacao

**Prompt do learner:**
```
Isso aqui eu nao entendo:

const todos = JSON.parse(localStorage.getItem('todos') || '[]');
todos.push({ id: Date.now(), text, completed: false });
localStorage.setItem('todos', JSON.stringify(todos));

Explique com detalhes como se eu fosse da quinta serie
e explique os first principles.
```

**IA explica com analogias:**
- localStorage = caderninho do navegador que nao apaga quando fecha
- JSON.parse = traduzir do idioma do caderninho pro idioma do JavaScript
- JSON.stringify = traduzir de volta pro idioma do caderninho
- `|| '[]'` = se o caderninho estiver vazio, comeca com uma lista vazia
- Date.now() = carimbo de data/hora unico pra identificar cada tarefa

### Passo 3: Se nao entendeu, aprofundar

**Prompt:**
```
Me de outros exemplos e outras analogias para localStorage.
```

**IA pode responder com:**
- localStorage e como um post-it colado no navegador
- Diferente de variaveis JavaScript que somem ao recarregar a pagina
- Exemplo pratico: salvar preferencia de tema dark/light

### Passo 4: Voltar ao chat original com entendimento

**Prompt no chat original:**
```
O visual esta feio, com icones que nao condizem com o projeto.
Mantenha uma estrutura visual mais agradavel.
```

Agora voce entende o codigo e sabe que o pedido visual nao vai quebrar a logica de localStorage.

## Templates de prompts para diferentes situacoes

### Trecho de codigo desconhecido
```
Isso aqui eu nao entendo: [TRECHO]
Explique com detalhes como se eu fosse da quinta serie
e explique os first principles.
```

### Explicacao confusa
```
Me de outros exemplos e outras analogias.
```

### Conceito especifico
```
O que e [CONCEITO]? Explique com first principles,
use analogias do dia a dia, e me de 3 exemplos praticos.
```

### Comparacao
```
Qual a diferenca entre [A] e [B]?
Explique como se eu fosse da quinta serie.
Quando uso um e quando uso outro?
```

### Validacao de entendimento
```
Meu entendimento e que [SUA EXPLICACAO].
Estou certo? O que estou errando ou simplificando demais?
```

## Sinais de que voce precisa usar este skill

1. Voce aceitou codigo da IA e nao consegue explicar o que ele faz
2. Alguem pergunta "por que voce fez assim?" e voce nao sabe responder
3. A IA gerou um bug e voce nao consegue identificar onde esta o problema
4. Voce esta copiando padroes sem saber por que funcionam
5. Voce sente "sindrome do impostor" ao olhar seu proprio codigo (que a IA escreveu)