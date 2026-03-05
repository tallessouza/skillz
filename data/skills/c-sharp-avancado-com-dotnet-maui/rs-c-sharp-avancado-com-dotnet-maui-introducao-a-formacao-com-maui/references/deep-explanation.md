# Deep Explanation: Introducao a Formacao .NET MAUI

## Por que visualizar o front-end ao desenvolver back-end?

O instrutor (Wellison) destaca que o trabalho de back-end e "abstrato" — diferente de quem cria sites ou apps, e dificil explicar (e ate entender) o que um back-end developer faz. Ter um design no Figma resolve isso:

- **Menos abstracao:** Ao ver uma tela, voce identifica "aqui precisa de um endpoint para inserir esse dado, para ler o dado, para colocar nessa tela com esse formato"
- **Melhor colaboracao:** Voce consegue questionar "o que acontece se o usuario clicar nesse botao sem preencher esse dado?" — contribuindo para um produto melhor
- **Motivacao:** Ver o Swagger e "uma coisa meio abstrata", mas ver um app funcionando no seu telefone conectando com sua API e tangivel

Essa e a razao de criar o app .NET MAUI junto com a API — nao e um curso focado em MAUI, mas sim usar o app como forma de materializar o back-end.

## A divisao 97/3 do Login Social

O instrutor enfatiza que login com Google (ou Facebook, Twitter/X, etc.) e **97% trabalho de back-end**. O app/site faz "alguma coisinha diferente", mas o grosso — chaves de acesso, fluxo OAuth, validacao de tokens, criacao de sessao — e responsabilidade da API. Isso e um insight importante para devs que acham que login social e "coisa de front-end".

## Por que nao VS Code para C#?

O instrutor e categorico: "Visual Studio Code nao. Eu nao tenho nada contra o Visual Studio Code, a questao e que e um editor de texto e no mundo C Sharp nao funciona." A razao e pratica — o Visual Studio (IDE completa) tem recursos nativos para:

- Formatacao de codigo C#
- Integracao API + App (recurso nativo para rodar ambos projetos simultaneamente)
- Debugging avancado com .NET MAUI
- Templates e scaffolding

## Conta Apple Developer — Contexto Historico

O instrutor compartilha que desde 2015 (quando publicou seu primeiro app na App Store) o preco da conta Apple Developer se manteve em $99/ano. Ele nota que isso e surpreendente dada a inflacao, mas avisa que pode mudar. Para fins de aprendizado, o simulador do Xcode e gratuito e suficiente.

## Servicos de Mac Remoto

O instrutor testou pessoalmente servicos que permitem alugar um Mac e acessar remotamente. Sua conclusao: "Eu nao recomendo. Fica lento, voce tem um delay ali no simulador do iPhone para voce clicar." A experiencia nao e boa para desenvolvimento com .NET MAUI.

## Template e Prerequisitos

O projeto usa um template de back-end baseado no projeto "CacheFlow" da trilha basica de C#, com Domain Driven Design e camadas. Ha "uma mudanca bem sutil" que sera explicada. Tudo que foi ensinado na trilha anterior (fundamentos C#, DDD, camadas) e reutilizado sem re-explicacao — por isso a trilha basica e pre-requisito obrigatorio.

## Aplicativo: PlanShare (To Do List App)

No Figma o nome e "To Do List App", mas no codigo o instrutor chama de **PlanShare**. O conceito e um app de tarefas compartilhadas onde:

- Usuarios criam contas (e-mail/senha ou Google)
- Criam tarefas com titulo, data, descricao, responsaveis e anexos
- Compartilham tarefas via codigo de convite (WebSocket/SignalR para tempo real)
- Gerenciam perfil (foto, nome, senha, deletar conta)