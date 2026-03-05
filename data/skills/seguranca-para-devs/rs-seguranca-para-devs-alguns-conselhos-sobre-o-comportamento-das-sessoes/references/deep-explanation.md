# Deep Explanation: Conselhos Sobre Comportamento de Sessoes

## Por que validar o Session ID como input de usuario

O ID de sessao vem no cookie e e tratado por muitos devs como algo "interno" do sistema. Mas ele e um valor que chega do navegador do usuario — ou do atacante. Se as sessoes estao armazenadas em banco de dados, um agressor pode manipular o cookie para injetar SQL atraves do session ID. A validacao deve ser identica a de qualquer campo de formulario: verificar tipo, tamanho e formato esperado (ex: string hexadecimal de 32 caracteres).

## A diferenca critica entre no-cache e no-store

Este e um dos pontos mais sutis e importantes da aula. Muitos desenvolvedores usam `Cache-Control: no-cache` achando que impede o cache. Na verdade:

- **no-cache**: O navegador DEVE revalidar com o servidor antes de usar, mas PODE armazenar a resposta completa no disco local. Isso inclui a requisicao HTTP inteira com todos os headers — incluindo cookies com o session ID.
- **no-store**: O navegador NAO DEVE armazenar nada no disco. A resposta fica apenas em memoria.

O risco concreto: se um atacante ganha acesso ao sistema de arquivos do computador da vitima (mesmo depois que o navegador foi fechado), ele pode ler os arquivos de cache do navegador e extrair o session ID em texto puro.

## O ataque da tela de login aberta

O instrutor descreve um cenario de ataque fisico muito pratico:

1. O atacante pede para usar o computador do colega
2. Abre a tela de login do sistema
3. Copia o session ID do cookie (a sessao ja foi criada, so nao esta autenticada)
4. Deixa a tela de login aberta e bloqueia o computador
5. O colega volta, desbloqueia, ve a tela de login e faz login normalmente
6. O session ID que o atacante copiou agora esta autenticado
7. O atacante usa o session ID copiado para acessar como o colega

A defesa: timeout de 30 segundos na tela de login. Sem interacao (teclado, mouse), redirecionar para logout que limpa o session ID. Quando o colega voltar, uma nova sessao sera criada.

## Por que renovar sessao em mudanca de privilegio

Dois motivos complementares:

1. **Seguranca**: A mudanca de privilegio geralmente acontece porque alguem detectou um problema de seguranca. Se o usuario comprometido ja esta logado, ele continua com as permissoes antigas ate a sessao expirar naturalmente.

2. **Consistencia de dados**: E comum armazenar roles/permissoes na sessao para evitar consultas ao banco a cada requisicao. Se as permissoes mudam no banco mas a sessao nao e renovada, o usuario opera com permissoes desatualizadas.

## Logout por inatividade: servidor vs cliente

- **No servidor (obrigatorio)**: E a unica garantia real. O servidor verifica que nao recebeu requisicoes do usuario por um periodo e invalida a sessao. Sem isso, um atacante com o session ID pode usa-lo indefinidamente.

- **No cliente (complementar para UX)**: Melhora a experiencia do usuario legitimo. Em vez de clicar em algo e receber um erro, o usuario ve uma mensagem amigavel pedindo para logar novamente. O exemplo do WordPress e citado: ao editar um post, aparece um overlay com login/senha que permite reautenticar sem perder o trabalho em andamento.

## Tempos de expiracao por tipo de negocio

O instrutor enfatiza que "curto" e relativo ao contexto:

| Tipo de negocio | Timeout | Justificativa |
|-----------------|---------|---------------|
| Fintech/Banco | 2-5 min | Dados financeiros, risco alto, usuarios esperam esse comportamento |
| E-commerce | 15-30 min | Equilibrio entre seguranca e experiencia de compra |
| Software corporativo | 4-8h | Usuario trabalha o dia inteiro, timeout muito curto prejudica produtividade |
| Rede social | Dias/semanas | Risco baixo, conveniencia e prioridade |