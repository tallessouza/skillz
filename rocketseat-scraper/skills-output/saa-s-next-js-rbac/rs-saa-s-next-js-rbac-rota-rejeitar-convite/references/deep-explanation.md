# Deep Explanation: Rota Rejeitar Convite

## Relacao com a rota de aceitar convite

O instrutor enfatiza que a rota de rejeitar convite e "bem semelhante" a de aceitar. A estrutura de validacao e identica — as tres verificacoes (invite existe, usuario existe, email confere) sao compartilhadas entre ambas as rotas.

A unica diferenca esta na acao final:
- **Accept:** cria um membership na organizacao + deleta o invite
- **Reject:** apenas deleta o invite

## Por que as validacoes sao identicas

Mesmo sendo uma operacao "destrutiva" (apenas delecao), as validacoes existem por razoes de seguranca:

1. **Invite existe?** — Previne operacoes em registros inexistentes, que podem indicar convites ja processados ou expirados
2. **Usuario existe?** — Garante que o token JWT refere um usuario valido no banco
3. **Email confere?** — Impede que um usuario rejeite convites de outros usuarios, o que seria uma vulnerabilidade de autorizacao

## Simplicidade da rota

O instrutor destaca que esta e "a rota mais simples" do projeto. Isso acontece porque:
- Nao ha logica de negocios complexa
- Nao ha criacao de registros (apenas delecao)
- As validacoes ja foram definidas na rota de accept
- O fluxo e linear sem branches condicionais

## Padrao arquitetural

Esta rota segue o padrao comum em sistemas de convite:
1. Autenticacao (via plugin `auth`)
2. Validacao de entrada (via Zod schema)
3. Validacoes de negocio (existencia + propriedade)
4. Acao (delete)
5. Resposta (204 No Content)