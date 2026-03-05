# Code Examples: Inicializando BehaviorSubject com LocalStorage

## Exemplo 1: Metodo completo de carga

```typescript
private loadTasksFromLocalStorage(key: string): TaskModel[] {
  try {
    const storageTasks = localStorage.getItem(key);
    return storageTasks ? JSON.parse(storageTasks) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas do local storage', error);
    return [];
  }
}
```

**Passo a passo:**
1. `localStorage.getItem(key)` retorna `string | null`
2. Se retornou string, `JSON.parse` converte para objeto JavaScript (array de tasks)
3. Se retornou null (key nao existe), retorna array vazio
4. Se `JSON.parse` falhar (dado corrompido), catch loga o erro e retorna array vazio

## Exemplo 2: Inicializacao dos tres BehaviorSubjects

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private toDoTasks$ = new BehaviorSubject<TaskModel[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.toDo)
  );

  private doingTasks$ = new BehaviorSubject<TaskModel[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.doing)
  );

  private doneTasks$ = new BehaviorSubject<TaskModel[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.done)
  );

  // ... metodos do service
}
```

**Nota:** Cada BehaviorSubject usa uma key diferente do enum, garantindo que toDo, doing e done sao armazenados e recuperados independentemente.

## Exemplo 3: Metodo de salvamento (video anterior, referenciado)

```typescript
private saveTasksOnLocalStorage(key: string, tasks: TaskModel[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (error) {
    console.error('Erro ao salvar tarefas no local storage', error);
  }
}
```

**Simetria:** `save` usa `JSON.stringify` + `setItem`, `load` usa `getItem` + `JSON.parse`. Ambos com try/catch e a key como parametro.

## Exemplo 4: Correcao de nomenclatura no componente

**Antes (nome confuso):**
```typescript
// task-comments-model.component.ts
onRemoveModel(commentId: string): void {
  // logica de remover comentario
}
```

```html
<!-- template -->
<button (click)="onRemoveModel(comment.id)">Remover</button>
```

**Depois (nome descritivo):**
```typescript
// task-comments-model.component.ts
onRemoveComment(commentId: string): void {
  // logica de remover comentario
}
```

```html
<!-- template -->
<button (click)="onRemoveComment(comment.id)">Remover</button>
```

## Exemplo 5: Variacao — se fosse assincrono (contra-exemplo)

Se usasse uma API assincrona, o pattern seria diferente e mais complexo:

```typescript
// NAO e o caso do localStorage, mas para comparacao:
private toDoTasks$ = new BehaviorSubject<TaskModel[]>([]);

constructor() {
  this.asyncStorage.getItem('toDo').then(data => {
    this.toDoTasks$.next(data ? JSON.parse(data) : []);
  });
}
```

Isso introduz um momento em que o BehaviorSubject esta com array vazio antes dos dados reais chegarem. A solucao sincrona do localStorage evita esse problema completamente.