# Deep Explanation: Validacao de Entrada e Sanitizacao

## O modelo mental de defesa em profundidade

O instrutor Elcio usa uma analogia muito clara: **trancar o portao E a porta**. Mesmo morando em condominio com porteiro, voce tranca o apartamento. Se alguem passar pelo porteiro, ainda tem a porta. Se voce esquecer de trancar a porta, ainda tem o porteiro.

Isso traduz diretamente para codigo:
- **Portao** = validacao de entrada (primeira camada)
- **Porta** = prepared queries, escape, sanitizacao interna (camadas internas)

Voce nunca depende de uma unica camada. Validacao de entrada e a camada mais externa — se voce cometer erro nas camadas internas (esquecer um prepared query, concatenar algo por acidente), a validacao ja bloqueou os payloads mais obvios.

## Por que nao escapar manualmente

O instrutor demonstra que escapar manualmente e um jogo de gato e rato:
- Voce bloqueia aspas simples (`'`) pensando que resolveu
- O atacante usa tres tracinhos (`---`) como comentario SQL e bypassa
- Voce bloqueia tracinhos, ele encontra outro vetor

A mensagem e clara: **"Eu nao quero fazer isso, cara. Ficar perseguindo tudo que seria possivel colocar aqui."** A biblioteca de SQL tem uma comunidade inteira dedicada a isso. Use-a.

## SQL Injection — os dois ataques demonstrados

### Ataque 1: OR 1=1
```
email: elcio@vise... ' OR 1=1 --
password: qualquer coisa
```
A query montada fica:
```sql
SELECT * FROM users WHERE email = 'elcio@vise...' OR 1=1 --' AND password = 'qualquer'
```
O `OR 1=1` torna a condicao sempre verdadeira. O `--` comenta o resto da query.

### Ataque 2: Comentario SQL simples
```
email: elcio@robervise.com.br' ---
password: qualquer coisa
```
Apenas fecha a aspas e comenta o resto. Mais simples, mesmo efeito.

## A superficie de ataque e maior do que voce pensa

O instrutor enfatiza um ponto critico: **nao e so o formulario**. Atacantes controlam:

1. **Campos de formulario** — o obvio
2. **Cookies** — exemplo do cookie de tema que vira `'; DROP DATABASE;`
3. **Headers HTTP** — User-Agent salvo em log no banco
4. **Query parameters** — IDs, filtros, paginacao
5. **Filenames** — mencionado da aula anterior sobre execucao de comandos OS
6. **Nome do cookie de sessao** — ate isso pode ser manipulado

Cada um desses e um vetor de injecao se o valor for concatenado em qualquer query ou comando.

## Validacao de email como exemplo pratico

Se o sistema validasse que o campo email so aceita emails validos (formato correto), os payloads de SQL Injection nao passariam porque contem caracteres invalidos para email (`'`, `--`, `;`). Nao e a solucao definitiva, mas e uma camada que "torna muito dificil a vida de quem quer tentar fazer um ataque de Injection".

## Conexao com outras aulas

O instrutor referencia:
- **Aula de autenticacao** — senhas devem estar com hash (salt + pepper), nunca em texto puro
- **Aula de execucao de comandos OS** — validar filenames, nao so form fields
- A ideia de que seguranca e um conjunto de camadas, nao uma solucao unica