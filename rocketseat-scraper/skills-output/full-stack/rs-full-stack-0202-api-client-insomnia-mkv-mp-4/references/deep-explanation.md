# Deep Explanation: API Client — Insomnia

## Por que precisamos de um API Client?

O navegador, por padrao, so consegue fazer requisicoes do tipo GET — quando voce digita uma URL na barra de endereco ou clica em um link, e sempre um GET. Isso e suficiente para navegar na web, mas quando estamos desenvolvendo APIs, precisamos testar outros metodos HTTP:

- **POST** — criar recursos (ex: criar um usuario)
- **PUT/PATCH** — atualizar recursos
- **DELETE** — remover recursos
- **HEAD, OPTIONS** — metadados e CORS

Sem um API client, voce precisaria escrever codigo (fetch/axios) so para testar se sua API funciona. O API client elimina essa friccao.

## Por que Insomnia e nao Postman?

O instrutor (Rocketseat) escolhe Insomnia por:

1. **Interface visual limpa** — menos poluida que o Postman
2. **Organizacao intuitiva** — a forma como colecoes e requests sao organizados e mais natural
3. **Adocao no mercado** — amplamente usado em empresas brasileiras de tecnologia
4. **Gratuito para uso individual** — o plano free cobre 100% das necessidades de desenvolvimento

O Postman e uma alternativa valida e igualmente popular. A escolha entre os dois e questao de preferencia.

## Thunder Client como alternativa leve

Para quem prefere nao sair do VS Code, a extensao Thunder Client oferece funcionalidade similar dentro do editor. E uma opcao valida para testes rapidos, mas o Insomnia oferece mais recursos de organizacao para projetos maiores.

## Fluxo de autenticacao do Insomnia

O Insomnia usa autenticacao via navegador:
1. Ao fazer login no app, ele abre o navegador
2. Voce autentica la (Google, GitHub, email)
3. Clica em "Launch" no navegador
4. O navegador pede para abrir o Insomnia ("Open Insomnia")
5. O app recebe o token e faz login automaticamente

Isso e um padrao OAuth2 — o app nunca ve sua senha diretamente.

## Versao gratuita vs paga

A versao gratuita do Insomnia e suficiente para:
- Criar e organizar requests
- Testar todos os metodos HTTP
- Usar variaveis de ambiente
- Importar/exportar colecoes

Os planos pagos adicionam colaboracao em equipe (convidar pessoas, controlar permissoes), o que so faz sentido em contexto empresarial.