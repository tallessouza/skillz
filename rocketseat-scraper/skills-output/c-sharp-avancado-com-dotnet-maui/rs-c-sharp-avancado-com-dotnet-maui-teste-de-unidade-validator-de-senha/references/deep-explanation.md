# Deep Explanation: Testes de Unidade para Validators de Senha

## Por que testar validators que delegam para outros validators?

O instrutor (Wellerson) enfatiza um ponto crucial: mesmo quando o `ChangePasswordValidator` simplesmente repassa a responsabilidade para o `PasswordValidator` (que ja foi testado no contexto de registro), os testes devem ser replicados. A razao:

> "É importante a gente fazer esses testes porque assim a gente cria camadas de proteção contra alterações sem querer ou até mesmo alterações que a pessoa fez com uma certa intenção mas não se atentou que ia quebrar alguns cenários."

Isso significa que se alguem alterar o `PasswordValidator` ou trocar a implementacao do `ChangePasswordValidator`, os testes vao capturar a regressao imediatamente.

## A armadilha do Ctrl-C Ctrl-V

O instrutor demonstra ao vivo o erro classico: ao copiar testes do `RegisterUserValidator` para o `ChangePasswordValidator`, ele inicialmente esquece de trocar `Password` por `NewPassword`. Isso e perigoso porque:

1. O validator so tem regra para `NewPassword`, nao para `Password`
2. Se voce seta `Password = string.Empty`, o validator ainda retorna `IsValid = true` (porque nao valida esse campo)
3. O teste falha, mas por um motivo confuso — voce acha que o validator esta errado quando na verdade e o teste

> "Tome muito cuidado com esses Ctrl-C Ctrl-V da vida. Vai linha a linha conferindo se faz sentido."

## Separacao de responsabilidades: Validator vs Use Case

A `RequestChangePassword` tem dois campos:
- `Password` — senha atual (validada no use case via BCrypt)
- `NewPassword` — nova senha (validada no validator)

A senha atual NAO e validada no validator porque a validacao requer acesso ao banco de dados (comparar com hash armazenado). Isso e responsabilidade do use case:

```csharp
// No ChangePasswordUseCase
var match = BCrypt.Verify(request.Password, user.Password);
if (!match) throw new UnauthorizedException();
```

O BCrypt nao descriptografa a senha — ele faz calculos matematicos para verificar se a senha em texto plano corresponde ao hash armazenado.

## Nomes de metodos: a correcao ao vivo

O instrutor corrige ao vivo os nomes dos metodos de `ErrorPasswordEmpty` e `ErrorPasswordInvalid` para `ErrorNewPasswordEmpty` e `ErrorNewPasswordInvalid`. A justificativa:

> "Precisa deixar claro ali o que você está esperando, se é um sucesso, se é um erro e por quê. Aqui o motivo é a new password, a nova senha, que está ou inválida ou vazia."

## Parametros de Builder com defaults

O pattern de usar `passwordLength = 10` como default no builder e intencional:
- 10 caracteres satisfaz a regra minima de 6
- Testes de sucesso nao precisam especificar tamanho
- Testes de tamanho invalido passam valores explicitos (1-5)
- O nome do parametro foi simplificado de algo enorme para apenas `passwordLength`