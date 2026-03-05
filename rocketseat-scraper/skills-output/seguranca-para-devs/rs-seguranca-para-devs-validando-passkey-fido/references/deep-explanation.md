# Deep Explanation: Validando Passkey FIDO

## Fluxo completo do registro

O processo de registro FIDO tem duas etapas no servidor:

1. **Gerar options (challenge)** — o servidor cria um challenge unico e envia ao navegador junto com configuracoes como `authenticatorSelection`
2. **Verificar registration** — o navegador gera a chave, o usuario interage (biometria/PIN se exigido), e o resultado volta ao servidor para validacao

O instrutor enfatiza que entre essas duas etapas, o challenge deve estar armazenado na session do usuario. Sem isso, nao ha como garantir que a resposta corresponde ao desafio enviado.

## Por que validar a origem?

A validacao de `expectedOrigin` (ex: `http://localhost:5000`) impede que um atacante faca um POST de outro dominio enviando uma chave forjada. E uma camada de protecao contra CSRF — mesmo que o atacante tenha o challenge, a origem nao bate.

## User Verification: a opcao que muda tudo

O instrutor demonstrou ao vivo a diferenca:

- **Com `userVerification: 'required'`** no `authenticatorSelection` + `requireUserVerification: true` na verificacao: o navegador pede PIN (Windows) ou biometria (Mac com Touch ID) antes de gerar a chave
- **Sem esses parametros**: a chave e gerada sem interacao extra

O ponto critico demonstrado: se voce exige `requireUserVerification: true` no servidor mas NAO envia `userVerification: 'required'` no challenge, o registro FALHA com a mensagem: "User verification is required, but user was not verified during attestation."

Ambos os lados precisam estar alinhados.

## Modelo de dados: por que 1:N

O instrutor explica com casos reais:
- Computador em casa + computador no escritorio
- Chave no celular + chave no desktop
- Dois computadores em casa

Cada dispositivo gera sua propria chave. Por isso a tabela de credentials deve ser separada da tabela de usuarios, com foreign key. Guardar `userId`, `credentialId` e `publicKey`.

## O que vem do registrationVerification

O objeto retornado contem muitos dados binarios (sequencias de bytes), mas apenas duas informacoes sao essenciais para persistir:
- **Credential ID** — identificador unico da chave
- **Credential Public Key** — chave publica usada posteriormente para validar o login

## Erro comum: nome da funcao

A biblioteca SimpleWebAuthn usa `verifyRegistrationResponse`, nao `validateRegistrationResponse`. O Copilot sugeriu o nome errado ao instrutor, causando um erro de import. O instrutor destacou isso como armadilha real.

## Opcoes avancadas mencionadas (nao aprofundadas)

O instrutor mencionou que e possivel controlar:
- Se a chave foi gerada no proprio dispositivo ou via Bluetooth/QR Code
- Tipo de autenticador (platform vs cross-platform)
- Nivel de attestation

Mas ressaltou que para quem esta comecando, o fluxo basico sem `requireUserVerification` e suficiente.