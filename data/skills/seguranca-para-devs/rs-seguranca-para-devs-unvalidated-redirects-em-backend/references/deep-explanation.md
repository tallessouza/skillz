# Deep Explanation: Unvalidated Redirects

## O ataque em detalhes

O cenario mais comum (80% dos casos segundo o instrutor) acontece no fluxo de login:

1. O site protege paginas com autenticacao — usuario nao logado e redirecionado para `/login.php`
2. Para melhorar a UX, o sistema passa um parametro `next` com a pagina original: `/login.php?next=/page2.php`
3. Apos o login, o sistema redireciona para o valor de `next`
4. O atacante explora isso: envia um link legitimo do site com `next=https://hacker.com/login.php`

### Por que o usuario cai no golpe

O instrutor enfatiza um ponto crucial: **o usuario nao tem obrigacao de ser tecnico**. O usuario ja aprendeu a verificar a URL antes de clicar — e a URL e legitima, e do site real. Depois de clicar, durante a navegacao, esperar que o usuario verifique a URL a cada pagina e irreal.

O atacante pode sofisticar ainda mais:
- Cria uma pagina de login identica no dominio malicioso
- Mostra "Senha invalida, tente novamente"
- Quando o usuario digita a senha "de novo", o site do hacker captura e redireciona de volta para o site real
- O usuario entra normalmente e nunca percebe que a senha foi roubada

### O insight do instrutor sobre simplicidade

> "E simples, mas nao menospreze — muita gente tem problema com isso."

A falha e trivial de explorar e trivial de corrigir. O perigo esta justamente na simplicidade: desenvolvedores subestimam o risco porque o codigo parece inofensivo.

## A hierarquia de mitigacao (detalhada)

### 1. Evitar redirect dinamico

A solucao mais segura e simplesmente nao ter redirect dinamico. Se a aplicacao funciona sem ele, remova. O instrutor usa o exemplo de um site com tres paginas: o usuario pode se confundir momentaneamente, mas vai encontrar a pagina. "Pessoas sao minimamente inteligentes para isso."

**Quando usar:** Sites pequenos, aplicacoes onde a UX de redirect nao e critica.

### 2. Dicionario de destinos

Em vez de passar a URL no parametro, passe um ID. O ID mapeia para uma URL no backend. Exemplo: `next=1` onde `1` e o ID da pagina no banco de dados.

**Vantagem:** O atacante so pode enviar numeros, e numeros so mapeiam para destinos que voce controla.

**Quando usar:** Aplicacoes com paginas em banco de dados, sistemas com rotas nomeadas.

### 3. Whitelist

Mantenha uma lista explicita de todos os destinos permitidos. Qualquer valor fora da lista e rejeitado.

**Quando usar:** Quando as rotas sao conhecidas mas nao vem de um banco/dicionario natural.

**Resposta ao bloqueio:** Depende da criticidade:
- Site de conteudo: redireciona para index silenciosamente
- Fintech/saude: loga a tentativa, alerta administrador, possivelmente mostra erro

### 4. Validacao de formato

Ultima opcao. Verifica que a URL comeca com `/` (caminho relativo) e nao com `//` (protocol-relative URL que permite redirecionamento externo).

**Por que e menos seguro:** O atacante pode encontrar URLs internas que voce nao gostaria (paginas administrativas, endpoints internos). Ele nao consegue mandar para fora, mas ainda pode explorar destinos internos indesejados.

## Onde o problema aparece alem do login

O instrutor alerta: login e o caso mais comum, mas **qualquer redirect dinamico** baseado em entrada do usuario e vulneravel. Revise toda a aplicacao:

- Redirects apos acoes (salvar formulario, completar checkout)
- Links de email com URLs de retorno
- Parametros de callback em OAuth/SSO
- URLs de retorno em integrações com terceiros

## Analogia do instrutor

O ataque funciona como um redirecionamento de correspondencia: voce envia uma carta para o endereco correto (site legitimo), mas alguem colocou um aviso no correio dizendo "mudamos de endereco" (parametro next malicioso). Sua carta (credenciais) vai parar no endereco errado.