# Deep Explanation: Model Grouping em ViewModels

## Por que agrupar propriedades em Models?

O instrutor (Welleson) demonstra o problema com um exemplo progressivo:

- **Login:** 2 propriedades (email, senha)
- **Criar conta:** 3 propriedades (nome, email, senha)
- **Criar tarefa:** 5+ propriedades (titulo, data, descricao, responsaveis, anexo)

Se cada propriedade for individual na ViewModel, junto com injecao de dependencia (NavigationService), regras de negocio e outros valores, a ViewModel vira uma "poluicao visual" — muitas linhas, dificil de manter.

A solucao e criar uma "entidade" (classe Model) que agrupa propriedades com significado contextual. Ex: `User` tem nome, email, senha, foto. `Login` tem email e senha.

## ObservableProperty: quando usar no Model vs na ViewModel

O instrutor faz uma demonstracao pratica crucial:

1. **Model.Email SEM ObservableProperty:** O valor e capturado corretamente quando o usuario digita na Entry. Porem, se voce alterar `Model.Email` via codigo, a View NAO atualiza (label nao muda, Entry nao reflete).

2. **Model inteiro COM ObservableProperty:** Se voce fizer `Model = new Login { Email = "bruce@tech.com" }`, a View atualiza porque o Model inteiro foi substituido e a notificacao foi disparada.

3. **Model.Email COM ObservableProperty:** Se voce precisa que alteracoes individuais em `Email` notifiquem a View, ai sim precisa transformar a classe Login em `partial class Login : ObservableObject` e usar `[ObservableProperty]` no email.

**Opiniao do instrutor:** Na maioria dos casos de formulario, voce NAO precisa observar as propriedades internas do Model. Voce so captura os valores quando o usuario clica em "Login". Nao tem label mostrando o email em tempo real, nao tem alteracao via codigo. Entao mantenha simples.

## Conflito de namespace

Quando voce cria uma pasta `Models` com uma classe `Login`, e na ViewModel voce tenta usar `Login model`, o compilador confunde:
- `Login` pode ser a classe `Models.Login`
- `Login` pode ser o namespace (pasta)

Solucao: usar o caminho `Models.Login`. O Visual Studio mostra `PlanShare.App` em cinza porque o namespace base ja e compartilhado — so precisa do `Models.Login`.

## Inicializacao obrigatoria

O valor default de qualquer objeto em C# e `null`. Se a Entry tentar fazer binding com `Model.Email` e `Model` for null, ocorre NullReferenceException. Por isso, SEMPRE inicialize no construtor.