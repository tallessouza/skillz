# Deep Explanation: O Problema com o AutoMapper e Controle de Dependencias

## Contexto historico

Em 2 de abril de 2025, Jimmy Bogard (autor do AutoMapper e MediatR) anunciou em seu blog que estava considerando tornar ambos os pacotes comerciais. A comunidade .NET reagiu fortemente, inclusive resgatando posts antigos do Reddit onde ele afirmava que o AutoMapper nunca seria pago.

Em 11 de julho de 2025, a versao 15.0.1 do AutoMapper foi lancada exigindo chave de licenca comercial. O site automapper.io passou a oferecer:

- **Community (gratuita):** apenas para estudos e projetos open source
- **Planos pagos:** a partir de $50/mes (AutoMapper) ou $80/mes (AutoMapper + MediatR)
- Precos escalam por numero de desenvolvedores (1-10, 11-50, ilimitado)
- Desconto de 20% no pagamento anual

## Principio legal: sem cobranca retroativa

Quando uma biblioteca gratuita se torna paga, nao ha cobranca retroativa. As versoes anteriores continuam gratuitas sob a licenca original. No caso do AutoMapper:

- **Versao 14.x:** ultima versao gratuita
- **Versao 15.0.1+:** requer licenca paga

Versoes gratuitas ainda podem receber patches de seguranca (ex: 14.0.1, 14.0.2), mas nao melhorias de performance ou funcionalidades novas.

## Sintaxe de versionamento NuGet

A sintaxe usa conceitos matematicos de conjuntos abertos e fechados:

- `[14.0.0]` — colchetes dos dois lados = versao exata (fechado-fechado)
- `[14.0.0, 15.0.0)` — colchete + parentese = intervalo incluindo 14.0.0 mas excluindo 15.0.0

Isso e uma funcionalidade do .NET, nao da IDE. Funciona em qualquer IDE (Visual Studio, Rider, VS Code) e tambem via `dotnet` CLI.

### Bug conhecido no Visual Studio

Quando uma versao intermediaria aparece (ex: 14.2.0) e voce atualiza pelo Visual Studio, ele sobrescreve a sintaxe de intervalo com a versao simples. E necessario reabrir o .csproj e recolocar a sintaxe de intervalo manualmente. Este pode ser um bug que ja foi corrigido dependendo da versao do Visual Studio.

## Analogia do instrutor: "E de onde a gente nao espera que vem"

O instrutor cita sua mae: "Filho, e de onde a gente nao espera que vem." Aplicando ao desenvolvimento: ninguem esperava que o AutoMapper se tornaria pago. Da mesma forma, ninguem pode garantir que o Entity Framework, ou qualquer outra biblioteca, permanecera gratuito para sempre.

## Experiencia real: troca de banco de dados

O instrutor compartilha uma experiencia em projeto com empresa alema:

- Projeto construido com banco nao-relacional (variacao do MongoDB)
- Arquiteto convenceu gerentes a trocar para SQL Server (decisao motivada por ego e falta de conhecimento)
- Graças ao isolamento via repositorios, a troca afetou apenas a camada de infraestrutura
- Sem isolamento, teria sido necessario alterar todas as regras de negocio

A licao: isolamento protege contra decisoes ruins de terceiros, nao apenas contra mudancas de licenca.

## Opcoes ao enfrentar biblioteca que se tornou paga

1. **Remover e fazer mapeamento manual** — mais trabalhoso, mais verboso
2. **Remover e usar biblioteca alternativa** — opcao preferida pelo instrutor (abordada na aula seguinte)
3. **Pagar a licenca** — viavel para empresas que dependem fortemente
4. **Fixar na ultima versao gratuita** — solucao temporaria, recebe patches de seguranca mas nao melhorias

## Postura sobre atualizacoes

O instrutor defende fortemente manter pacotes atualizados:
- Melhorias de performance
- Correcoes de bugs
- Patches de seguranca
- Novas funcionalidades

"Ah, quebrou ao atualizar? Le a documentacao e corrige." A responsabilidade de manter atualizado faz parte do trabalho do desenvolvedor.