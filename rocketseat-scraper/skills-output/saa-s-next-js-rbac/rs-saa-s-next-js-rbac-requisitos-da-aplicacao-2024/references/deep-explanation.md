# Deep Explanation: Requisitos de Aplicacao SaaS com RBAC

## Analogia do Instrutor

O instrutor compara a aplicacao diretamente com GitHub e Vercel: o usuario tem organizacoes, dentro de cada organizacao existem projetos, e membros com diferentes niveis de acesso. Essa analogia e poderosa porque todo desenvolvedor ja usou essas plataformas e entende intuitivamente a hierarquia.

## Por que Projetos sao Simples

O instrutor enfatiza repetidamente que as entidades de projeto sao propositalmente simples — sem muita logica de negocio. A razao: o objetivo do curso e ensinar a estrutura de autorizacao e multi-tenancy, nao regras de negocio de dominio. A ideia e que o aluno depois encaixe essa estrutura de RBAC em qualquer SaaS que esteja construindo.

Citacao chave: "Depois voce pode englobar essa estrutura que a gente esta criando aqui dentro com qualquer projeto que voce ja tenha, com qualquer funcionalidade que voce ja tenha pensado para o seu SaaS."

## Permissoes Condicionais — A Complexidade Real

O instrutor destaca que algumas permissoes nao sao binarias (sim/nao por role). Existem permissoes condicionais onde o member pode executar a acao, mas apenas se for o owner do recurso. Exemplos:

- **Update project**: Member so pode atualizar projeto que ele criou
- **Delete project**: Member so pode deletar projeto que ele criou

Isso significa que a verificacao de autorizacao precisa de duas camadas:
1. O role permite a acao? (RBAC puro)
2. O usuario e o owner do recurso? (ownership check)

## Billing como Role Especial

O role billing e unico no sistema:
- Limitado a 1 por organizacao
- Nao conta na formula de cobranca ($10/membro)
- Nao tem acesso a funcionalidades operacionais (criar/editar/deletar projetos)
- Existe apenas para ver informacoes financeiras

Isso e um padrao comum em SaaS reais: o responsavel financeiro precisa de acesso ao sistema sem ser um "membro" no sentido operacional.

## Shutdown vs Delete

O instrutor faz uma distincao importante entre "shutdown" e "delete" de organizacao. Em SaaS, raramente voce faz hard-delete de uma organizacao porque:
- Dados de billing precisam ser mantidos
- Pode haver obrigacoes legais de retencao
- O usuario pode querer reativar
- Auditorias podem precisar dos dados

A decisao entre soft-delete e hard-delete depende do SaaS especifico, mas o padrao e soft-delete.

## Organizacao do README como Ferramenta de Desenvolvimento

O instrutor criou um README detalhado com todas as features e uma tabela de permissoes. Ele enfatiza que isso da "clareza enorme" para entender quem pode fazer cada coisa. Essa abordagem de documentar requisitos e permissoes antes de codar e uma pratica valiosa que facilita:
- Planejamento do banco de dados
- Design das rotas da API
- Implementacao das regras de autorizacao
- Comunicacao com stakeholders

## Formula de Billing

A formula e simples mas ilustrativa:
- **$20 por projeto** criado na organizacao
- **$10 por membro**, excluindo membros com role billing

Isso demonstra como o billing precisa consultar dados de toda a organizacao (contagem de projetos + contagem de membros filtrada por role).