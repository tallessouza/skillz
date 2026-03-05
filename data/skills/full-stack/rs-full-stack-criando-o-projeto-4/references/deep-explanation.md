# Deep Explanation: Criando Projeto Node.js API

## Por que limpar o package.json antes de instalar dependencias

O instrutor enfatiza uma sequencia especifica: criar pasta → npm init → limpar package.json → so entao adicionar dependencias. Isso nao e arbitrario.

O `npm init -y` gera campos placeholder que poluem o arquivo. Se voce instala dependencias antes de limpar, o diff fica confuso — voce nao sabe o que foi intencional vs. o que era lixo do scaffold.

## Convenção de nomes: api-restaurant

O nome `api-restaurant` segue kebab-case e usa prefixo `api-` para indicar o tipo de projeto. Isso e uma convencao pratica:

- Em um diretorio com multiplos projetos, `api-restaurant`, `app-dashboard`, `web-landing` se auto-documentam
- kebab-case e o padrao npm — o proprio npm rejeita camelCase em nomes de pacote publicados
- O hifen separa tipo de dominio: `api` (tipo) + `restaurant` (dominio)

## O contexto do projeto

Este projeto e uma API para gerenciar pedidos por mesa de um restaurante. O instrutor escolheu esse dominio porque:
- Tem entidades claras (mesas, pedidos, itens)
- Tem operacoes CRUD naturais
- Tem relacionamentos simples (mesa → pedidos → itens)
- E familiar para qualquer pessoa que ja foi a um restaurante

## Por que remover keywords e test script

- `keywords`: so tem utilidade para pacotes publicados no npm. Projetos privados/APIs nao precisam
- `scripts.test` com o placeholder `echo "Error..."`: e ruido. Quando voce configurar Jest/Vitest, vai sobrescrever de qualquer forma. Manter o placeholder da a falsa impressao de que testes existem

## Terminal integrado do VSCode

O instrutor usa o terminal integrado do VSCode em vez de um terminal externo. Isso mantem o contexto — voce ve o codigo e o terminal na mesma janela, sem alternar entre aplicacoes. Para iniciantes, reduz a carga cognitiva de gerenciar multiplas janelas.