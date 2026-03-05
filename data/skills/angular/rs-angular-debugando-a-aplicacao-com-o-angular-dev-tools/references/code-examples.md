# Code Examples: Debugando com Angular DevTools

## Nao ha codigo para escrever nesta aula

Esta aula e sobre uma ferramenta de inspecao — nao envolve escrever codigo. Os exemplos abaixo ilustram o que o DevTools mostra visualmente.

## Exemplo de estrutura de componentes vista no DevTools

A arvore que o DevTools mostra para a aplicacao do instrutor:

```
AppComponent
├── AppHeader
├── AppMainContent
│   ├── AppWelcomeSection
│   └── AppTaskListSection
│       ├── AppTaskCard (task: {id: 1, nome: "...", descricao: "...", status: "..."})
│       ├── AppTaskCard (task: {id: 2, ...})
│       └── AppTaskCard (task: {id: 3, ...})
```

## Exemplo de informacoes do AppTaskCard no DevTools

### Servicos injetados
```
Injected Services:
├── TaskService (provided by: AppTaskListSection)
└── ModalControllerService (provided by: root)
```

### Inputs
```
Inputs:
└── task: {
      id: 1,
      nome: "Minha tarefa",
      descricao: "Descricao da tarefa",
      status: "pendente"
    }
```

### Propriedades internas
```
Properties:
├── _taskService: TaskService instance
└── _modalControllerService: ModalControllerService instance
```

## Componente vazio (AppHeader)

```
AppHeader:
├── Injected Services: (none)
├── Inputs: (none)
└── Properties: (none)
```

Isso e normal — o componente so tem template HTML sem logica.

## Como acessar o DevTools — passo a passo visual

```
1. Aplicacao rodando (ng serve)
2. Navegador → Botao direito → Inspecionar
3. DevTools abre → Procurar aba "Angular"
4. Aba Angular → arvore de componentes carregada automaticamente

Abas disponiveis:
[Components] [Profiler] [Injector Tree] [Router Tree]
```

## Exemplo de uso pratico: descobrir por que um Input esta errado

```
Cenario: AppTaskCard nao mostra o nome da tarefa

1. Abrir DevTools → aba Angular
2. Navegar ate AppTaskCard na arvore
3. Verificar secao Inputs → task
4. Se task.nome esta undefined → problema no componente pai
5. Navegar ate AppTaskListSection → verificar como passa o Input
```