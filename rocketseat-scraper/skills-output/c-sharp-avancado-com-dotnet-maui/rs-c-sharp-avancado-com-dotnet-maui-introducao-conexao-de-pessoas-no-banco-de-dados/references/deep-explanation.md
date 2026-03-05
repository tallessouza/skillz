# Deep Explanation: Conexao de Pessoas no Banco de Dados

## Por que tres tipos de relacao?

O instrutor (Ellison) explica que antes de modelar qualquer conexao no banco, voce precisa identificar qual dos tres tipos de relacao se aplica. A forma de descobrir e fazer duas perguntas simples:

1. "A pode ter muitos B?"
2. "B pode ter muitos A?"

| Resposta 1 | Resposta 2 | Tipo |
|-----------|-----------|------|
| Nao | Nao | 1:1 |
| Sim | Nao | 1:N |
| Sim | Sim | N:N |

## Analogias do instrutor

### CPF como exemplo de 1:1
"Eu, Ellison, so posso ter um CPF. E um CPF so pode estar associado a uma pessoa. Nao importa o que voce faca, voce nao vai conseguir trocar o numero do seu CPF."

A chave aqui e: pergunte "quem tem quem?" — faz mais sentido dizer "uma pessoa TEM um CPF" do que "um CPF tem uma pessoa". Entao a FK do CPF vai na tabela Pessoa.

### Passaporte como exemplo de 1:N
Uma pessoa pode ter N passaportes (expirados, de nacionalidades diferentes). Mas um passaporte sempre pertence a uma unica pessoa. O ID vai pro lado N (tabela Passaporte contem o PersonId).

### Cursos como exemplo de N:N
"Eu posso estar fazendo 2, 3, 4 cursos ao mesmo tempo. E um curso pode ter multiplas pessoas." Ambos os lados tem multiplas conexoes — junction table obrigatoria.

## Por que conexao usuario-usuario e N:N

O insight chave do instrutor: quando voce conecta a mesma entidade consigo mesma (User <-> User), a relacao e N:N porque:
- Ellison pode ter conexao com William, Fabio, Edilon (multiplas)
- William pode ter conexao com Ellison, Lidia, Paula, Marcos, Joao (multiplas)
- Conexoes NAO sao transitivas: Ellison ter conexao com William nao significa que Ellison tem conexao com Lidia

## Semantica de UserId vs ConnectedUserId

O instrutor fez questao de diferenciar os dois campos:
- `UserId`: quem ENVIOU o convite de conexao
- `ConnectedUserId`: quem RECEBEU e aceitou

Razao: "Eu fiz isso para a gente conseguir identificar, se precisar um dia, quem enviou o convite. Se um dia precisar, a gente tem no historico."

Isso significa que uma unica linha na junction table representa a conexao bidirecional — nao e necessario criar duas linhas (A->B e B->A).

## Bidirecionalidade implicita

"Se o Ellison tem conexao com o William, entao o contrario tambem e verdade. O William tem conexao com o Ellison."

Implicacao pratica: ao buscar conexoes de um usuario, voce precisa buscar tanto onde ele e `UserId` quanto onde ele e `ConnectedUserId`.

## Contexto do projeto

Essa modelagem faz parte de um app de tarefas (estilo task manager) onde:
- Usuarios se conectam entre si (amigos, familiares)
- Tarefas podem ser atribuidas a pessoas da sua rede de conexoes
- Cada usuario so ve e atribui tarefas para pessoas da SUA rede
- A implementacao comeca pelo backend, depois vai pro app MAUI