# Deep Explanation: Modelagem de Ameacas

## Por que modelagem de ameacas existe

O instrutor destaca um ponto fundamental: **nao existe maneira objetiva de dizer que um sistema nao tem falhas de seguranca**. Encontrar falhas e uma atividade criativa — e se defender delas tambem e. Sempre existira algo em que voce nao pensou e alguem vai pensar.

Essa e a razao pela qual profissionais de seguranca (tanto ofensivos quanto defensivos) costumam ser apaixonados pelo trabalho — e um trabalho criativo. Programadores, por formacao, tendem a ser mais objetivos. A modelagem de ameacas surge como disciplina para preencher essa lacuna: **forcar o programador a pensar em solucoes fora da caixa**.

## O padrao STRIDE

STRIDE e um acronimo criado pela Microsoft para categorizar ameacas:

- **S**poofing — falsificacao de identidade
- **T**ampering — adulteracao de dados
- **R**epudiation — negacao de acoes realizadas
- **I**nformation Disclosure — vazamento de informacoes
- **D**enial of Service — negacao de servico
- **E**levation of Privilege — escalacao de privilegios

O diagrama STRIDE tem tres tipos basicos de componente: processos, stores e atores externos, conectados por fluxos de dados. E intencionalmente simples e agnostico em relacao a tecnologias.

## Trust Boundaries — o conceito chave

O instrutor usa um exemplo revelador: se alguem invadir o proxy de APIs, isso **nao deve automaticamente** dar acesso completo ao PostgreSQL. O banco tem sua propria senha de root, e o usuario do proxy tem permissoes limitadas. Essa separacao e uma trust boundary.

Outro exemplo: o sistema parceiro esta fora de escopo porque e "desenvolvido por nossos parceiros de negocios" — voce nao controla o codigo deles, entao nao pode mitigar ameacas la dentro. Mas precisa se proteger contra o que vem de la.

## Raciocinio em cadeia para mitigacao

O instrutor demonstra um raciocinio progressivo sobre credential stuffing que e extremamente valioso:

1. **Problema:** Alguem pode usar credenciais vazadas para tentar login
2. **Mitigacao 1:** Token secreto compartilhado por parceiro (pre-autenticacao)
3. **Mas e se...** alguem invadir o sistema do parceiro e roubar o token?
4. **Mitigacao 2:** Rate limiting para limitar tentativas
5. **Mas e se...** o atacante fizer aos poucos, durante meses?
6. **Mitigacao 3:** Validar tentativas contra Have I Been Pwned e gerar alertas

Esse padrao de "e se?" encadeado e a essencia da modelagem de ameacas. Cada mitigacao gera uma nova pergunta ate que o risco residual seja aceitavel.

## Cornucopia — gamificacao da seguranca

O OWASP Cornucopia e um jogo de cartas para 3-6 jogadores que funciona assim:

1. Embaralhe e distribua as cartas (divididas por categoria: autenticacao, validacao de dados, gerenciamento de sessao, etc.)
2. Sorteie quem comeca
3. O jogador escolhe uma carta e le a ameaca descrita
4. Ele deve **convencer os colegas** de que a aplicacao da equipe tem esse problema
5. Se a equipe concordar, a ameaca vira uma tarefa e o jogador ganha 1 ponto
6. O proximo jogador deve jogar carta da mesma categoria; carta maior supera a anterior e da 1 ponto extra
7. Se nao tiver carta da mesma categoria, pode jogar outra categoria (ganha ponto pela ameaca mas nao o ponto extra)
8. Coringas podem ser usados a qualquer momento

O jogo e longo — reserve pelo menos uma tarde. Muitos times jogam com o Threat Dragon aberto, alimentando o diagrama em tempo real.

### Exemplo de carta

**5 de Autenticacao:** "Javier pode usar credenciais de teste, credenciais default ou credenciais faceis de adivinhar para se autenticar. Ou pode usar uma conta antiga ou uma conta nao necessaria para a aplicacao."

O jogador diria: "Tem um usuario padrao que e criado quando instalamos o framework e a gente nao apaga. No ambiente de CI, sobe com usuario padrao." → Equipe concorda → vira tarefa.

## Insight critico: seguranca nao e checklist

O instrutor enfatiza que **nao existe um checklist que, uma vez completado, garanta seguranca**. A modelagem de ameacas e um exercicio que deve ser repetido periodicamente. A cada 3 meses ou quando a arquitetura mudar, a equipe deve:

1. Abrir o diagrama no Threat Dragon
2. Verificar se mudou (novas funcoes, atores, componentes)
3. Jogar Cornucopia novamente
4. Atualizar ameacas e tarefas

O objetivo e **pensar a frente do agressor** — quando ele tentar invadir, vai perceber que alguem ja pensou em cada vetor.