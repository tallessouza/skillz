# Deep Explanation: Deletando Recursos no Terraform

## Por que plan antes de destroy?

O instrutor enfatiza que `plan` por padrao tenta montar um plano de criacao ou edicao. Para ver o plano de delecao, e obrigatorio passar `-destroy`. Isso e um detalhe que muitos esquecem — rodar `terraform plan` sem a flag mostra um plano de criacao, nao de destruicao.

## O problema do escopo aberto

Quando voce roda `terraform destroy` (ou `plan -destroy`) sem nenhum filtro, o Terraform interpreta como "destrua tudo que esta gerenciado neste modulo/repositorio". O instrutor chama isso de "scope totalmente aberto" — o Terraform nao sabe o que voce quer deletar, entao deleta tudo.

Isso e especialmente perigoso em repositorios grandes com dezenas ou centenas de recursos de infraestrutura.

## A solucao: --target

O flag `--target` permite apontar para um recurso especifico usando seu endereco completo no Terraform. A sintaxe para recursos dentro de modulos e:

```
module.<nome_do_modulo>.<tipo_do_recurso>.<nome_do_recurso>
```

Exemplo real da aula: `module.s3.aws_s3_bucket.bucket`

## Dependencias transitivas

Um ponto crucial levantado: ao deletar o bucket S3, o Terraform detectou que o CloudFront estava associado a ele (como origem) e o Website Configuration tambem. Resultado: o plan mostrou 3 recursos para deletar, nao apenas 1.

Isso acontece porque o Terraform resolve o grafo de dependencias. Se o recurso A depende do recurso B, e voce deleta B, A tambem precisa ser deletado.

## A rede de seguranca: prevent_destroy

O instrutor menciona que no meio dos recursos existe uma instancia que "nao pode ser deletada" — a instancia que mantem o estado do Terraform (backend S3). Isso foi configurado com `lifecycle { prevent_destroy = true }`.

A logica: mesmo que alguem rode um `terraform destroy` acidental sem target, pelo menos o estado do Terraform sobrevive, permitindo recuperacao.

## Tres formas equivalentes de destruir

1. `terraform destroy` — comando direto
2. `terraform apply -destroy` — via apply com flag
3. `terraform destroy --target X` — escopado

Todas aceitam `--target`. A regra e: o target usado no `plan -destroy` deve ser identico ao usado no comando de destruicao.

## Sobre downtime e recuperacao

O instrutor faz uma observacao pratica importante: mesmo que voce consiga recriar recursos automatizadamente (via Terraform), alguns recursos demoram. O CloudFront, por exemplo, levou 4 minutos para ser criado. Isso significa downtime real em caso de delecao acidental.

A mensagem e: automacao ajuda na recuperacao, mas prevencao (plan, target, prevent_destroy) e sempre melhor que remediar.