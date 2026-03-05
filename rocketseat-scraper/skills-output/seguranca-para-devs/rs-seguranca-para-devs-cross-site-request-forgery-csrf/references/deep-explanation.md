# Deep Explanation: Cross-Site Request Forgery (CSRF)

## O que e CSRF

CSRF e um ataque onde o hacker induz o usuario a executar acoes indesejadas em uma aplicacao onde ele ja esta autenticado. O atacante nao precisa roubar credenciais — ele abusa do fato de que o navegador envia cookies automaticamente.

## O vetor de ataque explicado pelo instrutor

O instrutor demonstra o ataque com um cenario de transferencia PIX:

1. **Aplicacao legitima** roda em `127.0.0.1:5000` com rota `/saque` que aceita POST
2. **Site do hacker** (`hacker.com`) contem um formulario identico, mas com campos hidden pre-preenchidos (valor: 1 milhao, chave: a do hacker)
3. O hacker publica um link para `hacker.com` num forum frequentado pelos usuarios da aplicacao
4. Quando o usuario clica, o formulario e submetido automaticamente — e o navegador envia o cookie de sessao junto

### A analogia do instrutor sobre o impacto

"Podia ser um POST que muda a senha, que curte um post numa rede social de um cara que quer artificialmente bombar, que publica um comentario com link para produto falsificado, que altera o endereco de entrega no e-commerce."

O ponto central: qualquer acao que o usuario autenticado pode fazer, o hacker pode forcar via CSRF.

## Primeira defesa: SameSite cookies

### SameSite=Strict
- O cookie de sessao **nunca** e enviado em requisicoes cross-site
- Mesmo navegacao normal (clicar num link externo) nao envia o cookie
- O usuario chega "deslogado" vindo de qualquer outro site

### SameSite=Lax
- Cookie e enviado em navegacao top-level (clicar num link)
- Cookie **nao** e enviado em submissoes de formulario cross-site, fetch, XMLHttpRequest
- Compromisso entre seguranca e usabilidade

### Limitacao critica do SameSite (insight do instrutor)

SameSite **nao protege** quando o ataque vem do mesmo dominio. Cenario real descrito:
- O site tem uma pagina `/termos` cujo conteudo vem de um CMS (WordPress antigo sem manutencao)
- O hacker invade o WordPress e injeta o formulario malicioso dentro do conteudo da pagina de termos
- Como a pagina `/termos` esta no mesmo dominio, o cookie de sessao vai normalmente
- O instrutor enfatiza: "Podia ser um fetch e nem ia aparecer na tela. Ou um POST para um iframe escondido."

## Segunda defesa: Nonce (token anti-CSRF)

### Como funciona
1. Servidor gera token aleatorio ao renderizar o formulario
2. Token e salvo na sessao do servidor E incluido como campo hidden no form
3. Ao receber o POST, servidor compara o token do form com o da sessao
4. Se batem: processa. Se nao: rejeita com 403
5. Token e apagado da sessao imediatamente (uso unico)

### Por que resolve o problema do mesmo dominio
O formulario injetado pelo hacker (mesmo dentro do proprio site) nao consegue:
- Gerar um nonce valido (nao tem acesso ao `secrets` do servidor)
- Ler o nonce de outra pagina (cada carregamento gera um diferente)
- Adivinhar o nonce (criptograficamente aleatorio)

### Beneficio colateral (mencionado pelo instrutor)
"De quebra ja resolve o problema do cara que ficou impaciente e clicou duas vezes no botao" — porque o nonce e consumido no primeiro clique, o segundo falha.

## Frameworks e a roda ja inventada

O instrutor enfatiza: Django, Py4Web, Laravel, Ruby on Rails ja tem anti-CSRF pronto. Muitas vezes ja vem ativo por padrao. Antes de implementar manualmente, verifique:
- Django: `{% csrf_token %}` no template + middleware `CsrfViewMiddleware`
- Rails: `authenticity_token` automatico em forms
- Laravel: `@csrf` directive no Blade
- Express: pacote `csurf` ou similar

Implementacao manual so faz sentido em micro-frameworks (Flask) ou quando nao ha framework.