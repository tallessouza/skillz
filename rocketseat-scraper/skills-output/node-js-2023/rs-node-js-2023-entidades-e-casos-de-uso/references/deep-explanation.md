# Deep Explanation: Entidades e Casos de Uso

## O grande exercicio mental

O instrutor enfatiza que o maior desafio para programadores e **se desconectar das camadas externas**. O vicio natural e: ao pensar em uma entidade, imediatamente pensar "isso e uma tabela no banco". DDD exige o exercicio contrario — pensar em como representar um problema da vida real em codigo puramente TypeScript, sem framework, sem banco, sem API.

## Arquitetura Limpa como contexto

A aplicacao e construida em camadas:
- **Camada mais externa**: framework, HTTP, banco de dados, mensageria
- **Adapters**: intermediarios
- **Camada mais interna**: dominio (onde DDD mora)

O codigo do dominio e tao limpo e desconectado que voce pode **copiar e colar de uma aplicacao para outra** (desde que use JS/TS) e ele continua funcionando com todos os seus testes.

## Como identificar entidades e casos de uso

A tecnica vem da **conversacao com experts de dominio**. O instrutor da um exemplo pratico:

> "Eu tenho muita dificuldade em saber as duvidas dos alunos. Eu tenho que responder os alunos e eu me perco em quais duvidas ja foram respondidas."

Dessa frase, extraimos:
- **Substantivos** (entidades): "eu" (instrutor), "duvidas" (question), "alunos" (student)
- **Verbos** (casos de uso): "responder" (answer)

O instrutor reforça: esse e um exemplo simplificado. Em conversas reais com experts de dominio, o insumo e muito mais rico — varios agentes envolvidos (instrutores respondendo, alunos criando topicos), e cada conversa gera muitas entidades e casos de uso.

## DDD para aqui — implementacao e com voce

Ponto crucial do instrutor: DDD nao dita como implementar. Nao exige OOP, nao exige funcional. Voce pode usar classes, tipagem pura, ou qualquer abordagem. O curso usa OOP por ser o mais comum no mercado, mas isso e uma escolha, nao uma regra do DDD.

## Projeto pratico: Forum

A aplicacao desenvolvida e um forum (similar ao forum do Ignite):
- Usuarios criam topicos
- Usuarios comentam e respondem
- Autor pode selecionar melhor resposta

Setup minimo: apenas `typescript` e `@types/node` — sem framework, sem ORM, proposital.

## A analogia da portabilidade

O instrutor usa uma analogia poderosa: o codigo do dominio e tao puro que voce pode "cortar" ele de um projeto e "colar" em outro, e ele funciona. Isso so e possivel porque nao tem nenhuma dependencia externa. Essa e a prova de que o dominio esta bem isolado.