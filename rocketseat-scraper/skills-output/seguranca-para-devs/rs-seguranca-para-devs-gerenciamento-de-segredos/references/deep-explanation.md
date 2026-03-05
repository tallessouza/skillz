# Deep Explanation: Gerenciamento de Segredos

## Por que segredos nao podem estar no codigo

O instrutor Elcio demonstra o problema de forma direta: ao escrever uma aplicacao Flask que conecta ao MySQL, os dados de conexao (host, usuario, senha, banco) estao hardcoded no `app.py`. Qualquer pessoa com acesso ao repositorio Git — colegas, atacantes que comprometam o repo, ou ate bots que escaneiam repositorios publicos — teria acesso completo ao banco de dados.

A solucao nao e criptografar o codigo ou esconder o repositorio. A solucao e **separar completamente segredos do codigo**.

## O pattern config.json + config-sample.json

O instrutor escolhe JSON, mas enfatiza que o pattern funciona com qualquer formato:
- `.env` (dotenv)
- `config.py` (Python)
- `config.json` (JSON)
- `config.yaml` (YAML)

O fluxo e sempre o mesmo:
1. Criar arquivo de configuracao real (`config.json`) com dados sensiveis
2. Criar arquivo sample (`config-sample.json`) com valores de exemplo
3. Adicionar o arquivo real ao `.gitignore`
4. Versionar apenas o sample

O sample serve como documentacao viva: mostra quais chaves a aplicacao precisa, sem expor valores reais.

## Principio da Minima Permissao (Least Privilege)

O instrutor demonstra dois niveis de minima permissao:

### Nivel 1: Banco de dados
A aplicacao so faz SELECT, entao o usuario do banco so recebe GRANT SELECT. O instrutor testa isso ao vivo: tenta um INSERT e recebe "insert command denied". Ele reconhece que "e chato de fazer, geralmente a galera da permissao pra tudo", mas enfatiza que torna a aplicacao mais segura.

### Nivel 2: Sistema operacional
Cria um usuario `seguro` sem permissoes de sudo. Demonstra que ao tentar `sudo su`, o sistema responde "esse ai nao e sudor". A logica: se a aplicacao tiver uma falha de seguranca e um atacante conseguir acesso, ele fica "engaiolado" — nao consegue acesso root, nao compromete outras aplicacoes, nao acessa a rede interna.

## Zero Trust na pratica

A frase-chave do instrutor: "O cara e programador, trabalha aqui na empresa, mas por que ele tem que ter esse acesso? Nao da acesso."

Zero Trust significa:
- Programadores que nao administram producao nao veem credenciais de producao
- Cada servico tem suas proprias credenciais isoladas
- Acesso e concedido apenas para quem realmente precisa executar uma tarefa

## Deploy keys no GitHub

O instrutor usa deploy keys (chaves SSH especificas do repositorio) em vez de dar acesso completo via chave pessoal. Detalhes:
- Gera chave SSH no servidor com `ssh-keygen`
- Adiciona a chave publica como deploy key no GitHub Settings
- Marca como read-only (sem acesso de escrita)
- Usa 2FA para proteger a operacao de adicionar a chave

## O que e considerado segredo

O instrutor lista explicitamente:
- Credenciais de banco de dados (host, usuario, senha)
- Chaves de API da AWS (S3, DynamoDB)
- Conexoes ao Redis
- Chaves de API de parceiros/servicos externos
- Qualquer informacao que, se exposta, comprometa a seguranca

Regra universal: **"O segredo nao pode estar no codigo. Ponto. Ele tem que estar no ambiente."**

## Bind address do banco de dados

O instrutor mostra que o MariaDB esta configurado com `bind-address = 127.0.0.1`, significando que so aceita conexoes locais. Mesmo com o firewall bloqueando a porta, essa configuracao e uma camada adicional de defesa (defense in depth).

Em cenarios reais com banco separado, usa-se VPC (Virtual Private Cloud) para isolar a comunicacao entre servidores de aplicacao e banco de dados.