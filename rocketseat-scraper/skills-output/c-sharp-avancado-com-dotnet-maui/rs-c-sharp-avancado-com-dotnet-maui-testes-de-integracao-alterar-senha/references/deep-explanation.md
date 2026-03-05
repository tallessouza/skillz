# Deep Explanation: Testes de Integracao com Mutacao de Estado

## Por que testes flaky acontecem em integracao .NET

O xUnit executa **classes de teste em paralelo**, mas as **funcoes dentro de cada classe executam em sequencia**. A ordem das funcoes dentro da classe e definida pelo .NET — voce nao controla.

Cada classe de teste que herda de `CustomClassFixture` compartilha **o mesmo banco de dados** para todas as funcoes daquela classe. Classes diferentes tem bancos diferentes.

### O cenario do bug

Imagine uma classe com dois testes:
1. `Success()` — troca a senha do usuario no banco
2. `Error_Password_Empty()` — usa `_user.GetPassword()` para enviar a senha atual

Se o .NET executar `Success()` primeiro:
- A senha no banco **muda**
- `_user.GetPassword()` retorna a senha **original** (definida na criacao do usuario)
- O teste de erro envia uma senha que **nao bate mais** com o banco
- A API retorna **2 erros** (senha invalida + senha vazia) ao inves de 1
- O assert `errors.Count.Should().Be(1)` **falha**

O instrutor Wellison enfatiza: "Talvez com voce nao aconteca, mas o .NET e maluco, ele executa as funcoes numa hora que ele define." O comportamento e nao-deterministico — pode passar 10 vezes e falhar na 11a.

### A analogia do banco de dados compartilhado

Pense no banco de dados da classe como uma mesa de restaurante compartilhada. Se um teste "suja a mesa" (muta o estado), o proximo teste que sentar ali vai encontrar a mesa suja. A solucao nao e limpar a mesa entre testes — e dar mesas separadas (classes separadas).

### Por que nao usar setup/teardown?

O instrutor optou por separar em classes ao inves de resetar o banco entre testes. Isso e mais simples e mais confiavel:
- Cada classe tem seu proprio banco de dados isolado
- Nao ha dependencia de ordem
- Nao ha overhead de reset

### Token invalido com request valida — por que?

O instrutor cria uma classe `ChangeUserPasswordInvalidTokenTest` que envia uma **request valida** com token invalido. A razao: se voce envia request invalida + token invalido, e a API retornar erro, voce nao sabe se foi por causa do token ou da request. Isolando a variavel (request valida, token invalido), voce garante que o 401 veio do token.

### Parametros nomeados como documentacao

O instrutor usa `token: _user.GetAccessToken()` ao inves de passar posicionalmente. Ele explica: "Se for uma coisa que vai deixar em duvida, a gente da parametros nomeados." Isso serve como documentacao inline — quem le o teste entende imediatamente o que cada argumento representa.

### Quando usar Builder vs instanciar na mao

Se voce precisa alterar todas as propriedades do objeto, usar o Builder para depois sobrescrever tudo nao faz sentido. Nesse caso, instancie diretamente: `new RequestChangePasswordJson { Password = x, NewPassword = y }`.