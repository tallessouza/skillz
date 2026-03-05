# Deep Explanation: AWS CloudFormation e Ferramentas Nativas de IaC

## Por que o instrutor NAO escolheu CloudFormation para o curso

O ponto central da aula e que, apesar de CloudFormation ser uma ferramenta valida e bem construida, ela cria um lock-in extra. O instrutor usa a expressao "ferramenta muito exclusiva" — ela so fala AWS. Se voce trabalha com GCP, precisa do Deployment Manager. Se trabalha com Azure, precisa do Resource Manager. Cada uma e um mundo separado.

O curso segue com uma ferramenta "mais ampla que consegue atender diversas provedoras" (revelada na proxima aula — Terraform/OpenTofu).

## O problema do console manual — explicacao completa

O instrutor faz questao de reforcar que criar recursos pelo console **funciona**. O EC2 vai subir, o servico vai rodar. O problema nao e funcional, e operacional:

1. **Manutenibilidade a longo prazo** — sem codigo versionado, nao ha como auditar quem fez o que
2. **Multiplas pessoas no console** — "varias pessoas mexendo, editando, deletando" gera caos
3. **Recursos duplicados** — sem visao centralizada, e facil criar o mesmo recurso duas vezes
4. **Custos** — recursos duplicados e orfaos aparecem na fatura no final do mes
5. **Nao e escalavel** — principio DevOps de automacao e violado

A frase-chave do instrutor: "Nao e que nao vai funcionar o recurso, ele vai funcionar sim, mas nao podemos dizer que e uma boa pratica pensando no IAC."

## O papel do CDK

O instrutor destaca o CDK como diferencial do CloudFormation. O CDK permite que **desenvolvedores** (nao apenas ops) escrevam infraestrutura usando linguagens familiares como TypeScript. Isso reduz a "quebra a nivel de conhecimento" e a "curva de aprendizado a nivel de tecnologia".

Isso e relevante porque mostra uma tendencia: IaC esta se movendo para ser mais acessivel a devs, nao apenas a especialistas em infra.

## Mapa de ferramentas nativas

| Provedor | Ferramenta | Linguagem/Formato | Diferencial |
|----------|------------|-------------------|-------------|
| AWS | CloudFormation | YAML/JSON + CDK (TypeScript, Python, etc.) | CDK permite usar linguagens de programacao |
| Azure | Resource Manager (ARM) | JSON + Bicep | Bicep e a evolucao simplificada do ARM |
| GCP | Deployment Manager | YAML + Jinja2/Python | Usa templates Jinja2 |

## O conceito de lock-in

O instrutor menciona que "nao e muito comum voce mudar de cloud", mas ainda assim recomenda considerar o lock-in. Isso porque:

- O lock-in nao e so sobre migrar de provedor
- Afeta tambem a flexibilidade de ferramentas e a contratacao de profissionais
- Uma equipe que so conhece CloudFormation tem dificuldade se precisar gerenciar recursos multi-cloud
- O investimento em aprender uma ferramenta multi-provedor tem ROI maior a longo prazo

## Free Tier da AWS

O instrutor recomenda criar conta na AWS porque:
- Varios servicos estao dentro do free tier
- Ha uma "quota maxima de uso" mensal sem cobranca
- Para estudo, e "mais do que suficiente"
- O curso vai trabalhar "majoritariamente com a AWS" neste e nos proximos modulos