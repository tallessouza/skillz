# Deep Explanation: Instalando MySQL Server e Workbench

## Por que instalacao Custom?

O instrutor enfatiza a escolha de **Custom** ao inves de Full ou Server Only. A razao e pragmatica: a instalacao Full traz diversos componentes que nunca serao usados no contexto do curso, consumindo espaco e recursos desnecessariamente. A filosofia e instalar apenas o que voce vai usar — MySQL Server (o banco em si) e MySQL Workbench (a interface visual).

## MySQL Server vs MySQL Workbench — Qual a diferenca?

O instrutor faz uma distincao clara:
- **MySQL Server**: E o banco de dados em si. Sua funcao e armazenar dados. Ele roda como um servico do Windows em background.
- **MySQL Workbench**: E uma ferramenta visual que se conecta ao servidor. Permite ver tabelas, registros, executar queries de forma intuitiva. Sem o Workbench, voce ainda teria o banco funcionando, mas precisaria usar linha de comando para interagir.

A analogia implicita: o Server e o "cofre" onde os dados ficam, o Workbench e a "chave com visor" que permite ver e manipular o que esta dentro.

## Por que desmarcar o startup automatico?

O instrutor e enfatico sobre economizar recursos da maquina. O MySQL Server rodando em background consome memoria e CPU mesmo quando voce nao esta desenvolvendo. A recomendacao e:

1. Deixar o startup como **Manual**
2. Quando for desenvolver, abrir Services e iniciar o MySQL80
3. Quando terminar, parar o servico

Isso e especialmente relevante para maquinas de desenvolvimento que rodam muitas ferramentas simultaneamente (IDE, browser, Docker, etc).

## Demonstracao do servico parado

O instrutor faz uma demonstracao didatica importante: para o servico MySQL, fecha o Workbench, reabre, e mostra que a conexao falha com "No connection established". Isso ensina que o Workbench depende do Server estar rodando — sao componentes independentes. Se o aluno encontrar esse erro no futuro, a primeira coisa a verificar e se o servico esta Running.

## Contexto: Entity Framework e multiplos bancos

O instrutor menciona que o Entity Framework suporta MySQL, PostgreSQL e SQL Server. A escolha do MySQL neste curso nao e obrigatoria — o EF abstrai as diferencas entre bancos. As unicas mudancas seriam:
- Pacote NuGet diferente
- String de conexao diferente
- Pequenas diferencas nas migrations

Isso significa que o conhecimento de instalacao e configuracao e transferivel: o padrao de "instalar servidor + ferramenta visual + gerenciar servico" se repete para qualquer banco.

## Senha root

A senha escolhida pelo instrutor (`@Password123`) serve como exemplo de senha que atende requisitos de complexidade (especial + maiuscula + minuscula + numeros) mas e facil de lembrar para ambiente de desenvolvimento. Em producao, obviamente, seria necessaria uma senha mais robusta.

## Usuario root

Todo banco de dados tem um usuario administrador. No MySQL, esse usuario se chama `root` por convencao. Ele tem permissao total sobre todos os schemas e dados. Para desenvolvimento local isso e suficiente; em producao, criam-se usuarios com permissoes restritas.