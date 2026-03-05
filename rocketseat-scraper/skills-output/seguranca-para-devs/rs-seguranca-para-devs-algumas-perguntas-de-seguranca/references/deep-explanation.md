# Deep Explanation: Perguntas de Segurança

## Por que cada critério falha na prática

### Memorabilidade
O instrutor exemplifica: "Qual o nome do primeiro motorista de táxi que te atendeu?" — ninguém lembra. Mas mesmo perguntas "fáceis" como "nome da primeira escola" falham porque a memória distorce ao longo dos anos. O próprio instrutor demonstra tentando responder 6 perguntas "boas" e só consegue responder 2 delas.

### Consistência
Preferências mudam: cantor favorito, sabor de bolo favorito. O instrutor relata que sua resposta sobre sabor de bolo muda de um dia para outro. Uma pergunta de segurança precisa ter a mesma resposta ao longo de toda a vida do usuário.

### Aplicabilidade
Contexto cultural importa. "Time de basquete favorito" no Brasil não funciona — a maioria não tem um. O instrutor, que assiste NBA e acompanhou campeonatos inteiros, não torce por nenhum time. Mesmo dentro do público-alvo, a pergunta pode não se aplicar.

### Confidencialidade — o critério mais crítico
Duas formas de quebrar:

1. **Engenharia social direta:** apelido está nas redes sociais
2. **Dedução probabilística:** modelo do primeiro carro é deduzível pela faixa etária. O instrutor calcula: jovens compram carros populares, numa época eram Gol/Uno/Celta/Fox, hoje são Onix/HB20/Mobi/Argo — apenas ~4 opções. Um atacante não precisa acertar a resposta de UM usuário, precisa acertar a de QUALQUER um entre centenas.

### Especificidade
"Qual o filme mais longo que você já assistiu?" — a maioria das pessoas não sabe a resposta. O instrutor enfatiza: a pessoa precisa ler a pergunta e ter UMA única resposta imediata na cabeça.

## O exercício prático do instrutor

Ele tenta responder 6 perguntas consideradas "boas":

1. **Faculdade que se inscreveu mas não frequentou** — "Nenhuma" (não aplicável)
2. **Nome da primeira escola** — Consegue responder (Jarguelin, bairro do Brooklyn, SP)
3. **Destino da excursão escolar mais memorável** — Tem 4-5 candidatas, não consegue escolher uma (não específica)
4. **Sobrenome do professor de matemática no 8º ano** — Teve 3 professores do 5º ao 8º, lembra os sobrenomes mas não qual era do 8º ano (não memorável o suficiente)
5. **Nome do primeiro brinquedo de pelúcia** — Nunca teve um com nome (não aplicável)
6. **Primeiro nome do instrutor de direção** — Lembra: "Guiné" (funciona)

Resultado: 2 de 6 perguntas utilizáveis. Isso para UM usuário. Imagine centenas de milhares.

## O vetor de ataque por phishing cruzado

Este é o insight mais valioso da aula. O instrutor descreve o ataque completo:

1. Seu app usa perguntas de segurança
2. Atacante cria um site relacionado ao mesmo nicho (ex: dicas de jogos online para um app de jogos)
3. No cadastro do site falso, usa as MESMAS perguntas de segurança
4. Divulga o site na comunidade de usuários do seu app
5. Usuários se cadastram no site falso e respondem as perguntas com as mesmas respostas
6. Atacante agora tem as respostas e pode recuperar as contas no app original

Isso funciona porque: as perguntas não são únicas por site e as pessoas respondem igual em todo lugar.

## Estudos científicos citados

### Microsoft (2009)
- 3 pesquisadores
- 16 páginas
- Conclusão: perguntas de segurança não são seguras

### Google (2015)
- 5 pesquisadores
- 10 páginas
- Descoberta principal: as pessoas escolhem as mesmas perguntas e respondem as mesmas coisas
- Padrões previsíveis tornam o sistema inútil

## Posição do instrutor

Direta e sem ambiguidade: "Não use. Se você se convenceu, pode pular para a próxima aula." A recomendação é absoluta, não condicional.