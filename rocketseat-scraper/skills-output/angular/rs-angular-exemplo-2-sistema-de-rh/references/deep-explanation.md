# Deep Explanation: DDD Aplicado a Sistema de RH em Angular

## O processo mental do instrutor

O instrutor demonstra um processo sistematico de 4 etapas que se repete para qualquer sistema:

1. **Comecar pelos requisitos** — nao pela tecnologia. Antes de pensar em Angular, ele lista o que o sistema precisa fazer.
2. **Agrupar por coesao** — requisitos que "falam sobre a mesma coisa" ficam juntos. Calcular salario e gerar pagamento mensal sao sobre dinheiro → mesmo dominio.
3. **Nomear o dominio** — dar um nome claro que qualquer pessoa do negocio entenderia (Folha de Pagamento, Recrutamento, Performance).
4. **Mapear para a aplicacao** — cada dominio vira uma feature Angular com sua propria rota.

## Por que essa separacao importa

O instrutor enfatiza: "Ja nota que aqui ja esta muito mais organizado?" — a organizacao por dominio faz com que:

- **Cada feature tenha apenas seus componentes** — payroll nao tem componentes de recrutamento
- **O que e necessario globalmente vai para core** — servicos essenciais como autenticacao
- **O que e reutilizavel vai para shared** — componentes que multiplas features usam

## A conexao DDD → Feature-Based Components

O ponto central da aula e que DDD nao e apenas uma tecnica de backend. No Angular, a consequencia direta de identificar dominios e ter features independentes na aplicacao. O instrutor repete essa ideia: "separar por dominio e consequencia sera uma feature da minha aplicacao."

## Entidades como pista para dominios

Cada dominio tem entidades distintas:
- **Payroll**: Funcionario (com dados salariais), Lancamento, Beneficio, Desconto
- **Recruitment**: Vaga, Candidato, EtapaProcesso, Entrevista  
- **Performance**: Avaliacao, Meta, Feedback, Competencia

Se duas areas compartilham muitas entidades, provavelmente sao o mesmo dominio. Se as entidades sao distintas, sao dominios separados.

## Padrao repetivel

O instrutor menciona que o proximo video tera "um ultimo exemplo parecido com esse tambem" — reforçando que esse processo de decomposicao e um padrao que se aplica a qualquer sistema, nao apenas RH.