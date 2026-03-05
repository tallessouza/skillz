# Code Examples: Como Resolver Bugs com IA

## Exemplo 1: Ponto e virgula faltando

O bug demonstrado na aula foi um ponto e virgula faltando em JavaScript. O editor sinalizava com sublinhado vermelho, mas o aluno nao percebia.

### O codigo com bug:
```javascript
// Linha com ponto e virgula faltando — editor mostra sublinhado vermelho
const items = document.querySelectorAll('.item')  // <-- falta ; aqui

// O codigo quebra de formas imprevisiveis
```

### Como a IA resolveu:
1. Investigou os arquivos do projeto automaticamente
2. Identificou corretamente que faltava ponto e virgula
3. Indicou uma linha (105) que nao era exatamente a correta
4. A explicacao do problema estava correta apesar da linha errada

### Licao: validar a localizacao manualmente

## Exemplo 2: Templates de perguntas para debugging

### Nivel 1 — Basico (funciona, mas nao e ideal):
```
"Nao consigo ver a opacidade na minha lista"
```

### Nivel 2 — Com contexto de arquivo:
```
"Nao consigo ver a opacidade na minha lista.
O arquivo relevante e styles.css (ja aberto no editor)."
```

### Nivel 3 — Com screenshot:
```
"Nao consigo ver a opacidade na minha lista.
[screenshot da tela mostrando o problema]
Os arquivos relevantes sao index.html e styles.css."
```

### Nivel 4 — Com screenshot + comportamento esperado:
```
"Nao consigo ver a opacidade na minha lista.
[screenshot da tela mostrando o problema]
Esperava que os itens da lista ficassem com 50% de opacidade.
Arquivos: index.html, styles.css, script.js."
```

## Exemplo 3: Como adicionar contexto no editor

### Opcao A — Arquivo aberto:
Se o arquivo esta aberto no editor, ele automaticamente aparece no contexto da IA.

### Opcao B — Adicionar manualmente:
Clicar no botao de adicionar contexto e selecionar os arquivos relevantes.

### Opcao C — Screenshot:
Para problemas visuais, Ctrl+C do print e Ctrl+V na conversa.

## Exemplo 4: Erros comuns de iniciantes e como descrever para a IA

| Erro real | Descricao ruim | Descricao boa |
|-----------|---------------|---------------|
| Falta ponto e virgula | "Meu codigo nao funciona" | "Meu CSS nao esta aplicando o estilo na lista, arquivo styles.css" |
| Variavel undefined | "Da erro" | "Recebo 'undefined' quando tento acessar user.name na linha 42" |
| Imagem nao carrega | "A imagem sumiu" | "A imagem do header nao aparece, o caminho e ./img/logo.png" |
| Layout quebrado | "Ta feio" | "O menu esta aparecendo embaixo do conteudo em vez de ao lado" + screenshot |
| Evento nao dispara | "O botao nao funciona" | "Clico no botao 'Enviar' e nada acontece, sem erros no console" |