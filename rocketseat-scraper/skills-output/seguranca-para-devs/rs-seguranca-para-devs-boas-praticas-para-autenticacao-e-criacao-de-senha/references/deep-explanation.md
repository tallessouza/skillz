# Deep Explanation: Boas Praticas para Autenticacao e Senha

## Por que separar logins administrativos de usuarios publicos?

O instrutor enfatiza que o administrador — aquele que tem permissao de ver contas de usuarios — nao pode estar na mesma tabela de login do usuario comum que "qualquer um entra e se cadastra". A separacao elimina classes inteiras de falhas de seguranca porque as permissoes ja estao em sistemas separados. Voce nao precisa conferir uma serie de coisas quando o proprio sistema ja impoe a separacao.

Caso extremo mencionado: aplicacoes que criam usuarios no Active Directory (AD) do dono da aplicacao quando alguem se cadastra no frontend publico. Isso da a qualquer hacker na internet a capacidade de criar um usuario no AD corporativo. O instrutor e enfatico: "nao faca isso, por favor."

## Por que HTTPS e inegociavel

"Todo o trafego que nao passa por HTTPS e um trafego aberto, pode ser lido por qualquer pessoa que esteja no meio do caminho." O instrutor lista explicitamente quem pode interceptar: administrador de rede, alguem que invadiu o roteador, um funcionario do provedor de internet. "Nao existe uma maneira de fazer alguem digitar uma senha num formulario de internet e enviar essa senha sem HTTPS e isso ser seguro."

## A matematica por tras do minimo de 8 caracteres

O instrutor demonstra com zxcvbn a diferenca dramatica entre 7 e 8 caracteres numa senha com caracteres especiais, numeros, letras maiusculas e minusculas:

| Cenario de ataque | 7 caracteres | 8 caracteres |
|-------------------|-------------|-------------|
| Online (100 req/hora) | 11 anos | 4 meses* |
| Online (sem limite) | 12 dias | — |
| Offline (slow hash) | 17 minutos | 3 horas |
| Offline (hash fraco) | < 1 segundo | — |

*Os valores exatos variam conforme a composicao da senha.

O insight chave: "um caracterzinho de diferenca ja torna a maior parte dos ataques bem mais difíceis." Executar algo que consome processamento por 3 horas sem a infra alertar e muito mais dificil do que 17 minutos.

## Por que maximo de 64 e nao 16?

O instrutor explica duas razoes:
1. **Prevencao de DoS**: sem limite, alguem pode enviar milhares de caracteres para gerar hash, sobrecarregando o servidor
2. **Generosidade**: "deixa o cara criar uma senha segura. Se ele usa um gerenciador de senhas... 64 e um numero bem generoso." O instrutor explicitamente descarta 16 como muito restritivo.

## HaveIBeenPwned — como funciona por dentro

O instrutor demonstra o fluxo k-anonymity da API:
1. Calcular SHA1 da senha
2. Enviar apenas os 5 primeiros caracteres do hash (privacidade preservada)
3. Receber lista de todos os hashes que comecam com aqueles 5 caracteres
4. Buscar localmente o restante do hash

Exemplo: a senha "123mudar" apareceu 742.681 vezes em vazamentos. "Voce nao quer que o seu usuario possa cadastrar uma senha que esteja vazada aqui."

A razao e pratica: "e muito comum que as pessoas usem o mesmo login e senha em varios sites. Aquele e-mail associado aquela senha ja esta na mao do hacker."

## zxcvbn — por que e superior a validacoes tradicionais

O instrutor destaca que zxcvbn (feita pelo pessoal do Dropbox) tem um nivel de sofisticacao que nenhuma outra biblioteca alcanca. O diferencial principal: **user_inputs**.

Exemplo do instrutor: mesmo um nome inventado como "Pafuncios" — que nao esta em nenhum dicionario publico — recebe score 0 quando passado como user_input. A biblioteca cria um dicionario personalizado com os dados do usuario e roda ataque de dicionario contra eles.

O resultado da zxcvbn inclui:
- Score (0-4)
- Tempo estimado para quebra em varios cenarios
- Sequencias detectadas (forca bruta, dicionario, padroes)
- Feedback acionavel

## Validacao no servidor — nao e opcional

"Nao adianta colocar so um maxlength no campo de formulario e achar que voce esta seguro. O sujeito que vai fazer um ataque de forca bruta, ele vai so remover o maxlength do formulario, vai fazer POST direto, sem passar pelo formulario."

## Nunca truncar senhas

O instrutor explica o cenario: JavaScript falha, senha maior e submetida, sistema trunca e cadastra. Depois o usuario tenta logar com a senha completa e nao consegue. A solucao correta e rejeitar com erro, nunca aceitar silenciosamente.

## User ID nao-sequencial

IDs sequenciais (1, 2, 3) permitem ataques de enumeracao de usuarios. O instrutor nota que "nao e essencial, mas e preferível. Se for possivel, e melhor."

## Email como login — tradeoff

Facilidade: usuario nao precisa lembrar um nome de usuario separado. Complicacao: se precisar trocar de email, gera problema. O instrutor sugere avaliar se troca de email e caso de uso comum entre os usuarios.