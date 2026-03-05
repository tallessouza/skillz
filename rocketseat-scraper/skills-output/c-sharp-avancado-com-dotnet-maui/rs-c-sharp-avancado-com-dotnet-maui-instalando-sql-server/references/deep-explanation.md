# Deep Explanation: Instalando SQL Server

## Por que Instalacao Customizada?

O instrutor enfatiza escolher **Customized** em vez de **Basic** porque a instalacao basica inclui componentes como Machine Learning Services e Data Quality Services que consomem espaco e recursos sem necessidade para desenvolvimento de APIs. A filosofia e: instale apenas o que vai usar.

## Mixed Mode vs Windows Authentication

Este e o ponto mais critico da instalacao. O instrutor destaca com enfase: se voce marcar apenas Windows Authentication, sua API nao conseguira se conectar ao banco. APIs precisam de um usuario e senha (credenciais) para autenticacao — nao podem usar a conta Windows do desenvolvedor. O Mixed Mode permite ambas as formas:

1. **SQL Server Authentication**: usuario SA + senha (usado pela API)
2. **Windows Authentication**: seu usuario Windows (usado pelo SSMS no dia a dia)

## Usuario SA

SA significa "System Administrator" — e o usuario administrador padrao do SQL Server. A senha definida durante a instalacao e a unica oportunidade facil de configura-la. O instrutor usa `@Password123` como exemplo por ser ambiente de desenvolvimento, mas em producao a senha deve ser muito mais forte.

## Analogia com MySQL

O instrutor compara o SSMS com o MySQL Workbench — ambos sao ferramentas visuais para gerenciar seus respectivos bancos de dados. O SQL Server sozinho e o servidor rodando em background; o SSMS e a interface grafica para interagir com ele.

## Gerenciamento de Servicos — Dica de Produtividade

O instrutor compartilha uma pratica pessoal importante: configurar os servicos de banco de dados (SQL Server, MySQL) como **Manual** em vez de **Automatico**. A razao pratica:

- Nem todo dia voce trabalha com banco de dados
- Servicos automaticos consomem CPU e memoria constantemente
- Com startup manual, voce inicia o servico apenas quando precisa
- Se esquecer de iniciar, o SSMS simplesmente nao conecta — ai voce lembra de ir em Services e dar Start

Isso demonstra consciencia sobre recursos da maquina, especialmente importante para desenvolvedores que rodam multiplas ferramentas simultaneamente.

## Trust Server Certificate

O instrutor encontra um erro ao tentar conectar pela primeira vez — o certificado nao foi validado. A solucao e simples: marcar a opcao "Trust Server Certificate" na tela de login do SSMS. Isso e comum em ambientes de desenvolvimento local onde nao ha certificado SSL configurado.