# Deep Explanation: Estrutura de Aulas

## Por que um ambiente minimo?

O instrutor da Rocketseat criou deliberadamente um ambiente com apenas dois arquivos (`index.html` e `scripts.js`) para eliminar toda distracao. A filosofia e: quando se esta aprendendo conceitos fundamentais de JavaScript, qualquer complexidade adicional (frameworks, build tools, CSS elaborado, HTML complexo) compete pela atencao do aluno.

O HTML existe apenas como veiculo para carregar o JavaScript. Nada mais. O `<body>` nao tem conteudo visual — todo output vai para o console do navegador.

## Por que limpar o script a cada aula?

O instrutor enfatiza: "toda aula eu sempre vou comecar com esse script.js vazio". A razao e didatica — cada conceito deve ser explicado de forma isolada, sem dependencias de codigo anterior. Isso evita:

1. **Confusao de contexto** — o aluno nao sabe se uma variavel veio da aula atual ou anterior
2. **Efeitos colaterais** — codigo anterior pode interferir no comportamento do conceito novo
3. **Complexidade acumulada** — o arquivo cresce e fica dificil focar no que importa

## A sugestao de duplicar pastas

O instrutor oferece uma sugestao pratica: duplicar a pasta do projeto antes de limpar, criando um historico por aula. Exemplo:

```
classroom-aula-01/
classroom-aula-02/
classroom-aula-03/
```

Isso permite revisitar qualquer conceito anterior sem perder o principio de comecar limpo.

## Live Server como ferramenta essencial

O uso do Live Server nao e apenas conveniencia — e parte do workflow. Ele permite:

- **Hot reload**: salvar o arquivo e ver o resultado instantaneamente no console
- **Servidor HTTP real**: evita problemas de CORS e restricoes de `file://`
- **Feedback loop rapido**: escrever → salvar → ver resultado, sem recarregar manualmente

## Layout de tela recomendado

O instrutor mostra seu layout: VS Code de um lado, navegador com DevTools aberto do outro. A aba Console do DevTools e o "output" principal. Isso cria um fluxo visual direto:

```
[VS Code: scripts.js] | [Navegador: Console]
   Escreve codigo     →    Ve resultado
```

## Filosofia geral

"Nesse momento a gente vai focar nos conceitos e depois a gente vai colocar tudo em pratica em um projeto."

A separacao clara entre aprender conceitos (ambiente minimo) e aplicar em projetos (ambiente completo) e intencional. Primeiro dominar as pecas individuais, depois montar o quebra-cabeca.