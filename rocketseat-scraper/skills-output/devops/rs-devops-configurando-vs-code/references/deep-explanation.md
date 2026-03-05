# Deep Explanation: Configurando VSCode para Terraform

## Por que nao usar a extensao oficial HashiCorp?

O instrutor destaca que, apesar de ser a extensao "oficial" da HashiCorp, ela tem avaliacao muito baixa na marketplace do VSCode. Isso e um indicador pratico de que a comunidade nao esta satisfeita com a qualidade. O instrutor menciona que nao a recomenda "a longo prazo", sugerindo que pode funcionar para testes rapidos mas nao e confiavel para uso diario.

## O que a extensao community oferece

A extensao recomendada (community "Terraform", v0.2+) oferece:

1. **Syntax highlighting** — o principal beneficio. Identifica keywords HCL como `resource`, `module`, `variable`, `output` e aplica cores distintas
2. **Autocomplete basico** — o instrutor destaca que e "muito pouco, mas um pouquinho", ou seja, nao espere IntelliSense completo
3. **Validacao sintatica basica** — o instrutor nota que "o Terraform tem algumas especificidades" que a extensao nao cobre completamente
4. **Icone do Terraform** — identifica visualmente arquivos `.tf` no explorer

## Contexto: SSO ja configurado

Esta aula vem apos a configuracao de SSO (Single Sign-On) para acesso a cloud providers. O fluxo logico e: primeiro configurar acesso seguro (SSO), depois configurar o ambiente de desenvolvimento (VSCode), para entao comecar a escrever infraestrutura como codigo.

## Experiencia do instrutor

O instrutor menciona que testou "boa parte" das extensoes Terraform disponiveis na marketplace e a unica que realmente o ajudou foi a community. Isso da peso a recomendacao — nao e uma escolha arbitraria, e baseada em teste pratico de multiplas alternativas.