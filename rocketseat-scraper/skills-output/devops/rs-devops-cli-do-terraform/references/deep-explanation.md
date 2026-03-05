# Deep Explanation: Terraform CLI

## Por que nomear repositorios IaC explicitamente?

O instrutor enfatiza que, da mesma forma que existem repositorios de backend e frontend, o repositorio de infraestrutura deve ser facilmente identificavel. Convencoes aceitas:

- `nome-projeto-iac` (usado no curso)
- `nome-projeto.iac`
- `nome-projeto.infra`

O ponto e organizacao em escala — quando voce tem dezenas de repos, saber qual e IaC pelo nome evita confusao.

## O ciclo init → validate → plan → apply

O Terraform e **pautado pelo estado**. Isso e central para entender os comandos:

1. **init**: Prepara o ambiente local. Baixa plugins do provider, cria a pasta `.terraform/` e o arquivo `.terraform.lock.hcl`. Pode ser rodado em diretorio vazio (mensagem: "initialized in an empty directory"), mas o valor real aparece quando ja ha um provider configurado.

2. **validate**: Validacao de sintaxe HCL pura. Nao se comunica com a nuvem. Util para debug rapido.

3. **plan**: O instrutor usa a analogia de "dry run" ou "execucao seca". O plan:
   - Le o que foi escrito nos arquivos `.tf`
   - Compara com o estado atual
   - Mostra o que sera criado, alterado ou destruido
   - **Nao executa nada** — e apenas uma previsao
   - Se houver problemas (ex: recurso invalido), retorna erro nesta etapa

4. **apply**: Executa de fato o que o plan mostrou. Cria ou atualiza recursos reais na nuvem.

5. **destroy**: Funciona como um apply invertido. Internamente roda um plan que mostra o que sera deletado, e depois executa a delecao. O instrutor destaca que e um "comando bem sensivel" porque deleta recursos reais.

## O arquivo `.terraform.lock.hcl`

Gerado automaticamente pelo `terraform init`. Controla versoes exatas dos providers utilizados. O instrutor menciona que "o Terraform e pautado pelo estado" e que este lock e parte do sistema de controle de estado.

## Autenticacao: simples vs segura

O instrutor menciona explicitamente dois caminhos:
- **Metodo facil**: Gerar access keys direto na AWS (nao recomendado)
- **Metodo seguro**: Configurar SSO via AWS CLI (abordado na proxima aula)

A razao para preferir SSO: seguranca. Keys estaticas sao um risco se vazarem.

## O bloco provider vazio

```hcl
provider "aws" {
  # vazio por enquanto
}
```

O instrutor deixa o bloco provider vazio intencionalmente. Isso porque a autenticacao sera feita via AWS CLI/SSO externamente, nao hardcoded no arquivo. O Terraform resolve credenciais pela chain padrao da AWS (env vars → config file → SSO).

## Dependencia da AWS CLI

Para qualquer operacao que envolva criar recursos na AWS, e necessario:
1. Instalar a AWS CLI localmente
2. Configurar SSO (proximo passo no curso)
3. Gerar tokens de conexao local com o provider de cloud

Sem isso, `terraform plan` e `terraform apply` falham porque nao conseguem se comunicar com a AWS.