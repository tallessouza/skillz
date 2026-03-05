# Deep Explanation: Implementando OTP

## Como funciona o TOTP internamente

O TOTP (Time-based One-Time Password) funciona combinando um segredo compartilhado com o timestamp atual. O algoritmo divide o tempo em janelas de 30 segundos e gera um codigo de 6 digitos para cada janela. Como tanto o servidor quanto o authenticator do usuario conhecem o segredo e o tempo, ambos geram o mesmo codigo simultaneamente.

## Dois tipos de OTP: TOTP vs HOTP

- **TOTP (Time-based):** Baseado em tempo. Codigo muda a cada 30 segundos. Usado em 99% dos casos. E o que Google Authenticator, Microsoft Authenticator, Authy e Ente usam.
- **HOTP (HMAC-based):** Baseado em contagem. Cada vez que um codigo e usado, o contador incrementa. Menos comum, usado em tokens hardware como YubiKey em modo OTP.

O instrutor enfatiza: "De maneira geral, em 99% dos casos, voce vai usar o TOTP."

## URI de provisionamento

O formato da URI segue o padrao `otpauth://`:

```
otpauth://totp/DevSeguro:elcio@avise.com.br?secret=XXXX&issuer=DevSeguro
```

Componentes:
- `otpauth://` — protocolo especifico para OTP
- `totp/` — tipo de OTP (poderia ser `hotp/`)
- `DevSeguro:` — issuer (nome do servico)
- `elcio@avise.com.br` — identificador do usuario
- `secret=` — o segredo base32
- `issuer=` — issuer repetido na query string (redundancia para compatibilidade)

Essa URI e o que vai dentro do QR Code. Se o usuario nao conseguir escanear o QR Code, ele pode clicar "digitar manualmente" no authenticator e inserir apenas o segredo.

## Por que validar antes de ativar

O instrutor destaca um cenario critico: se voce ativar 2FA sem confirmar que o dispositivo do usuario esta sincronizado, e houver qualquer problema (QR Code mal lido, relogio desincronizado, app com bug), o usuario fica **trancado fora da conta**. Isso gera:

1. Chamados de suporte desnecessarios
2. Frustacao do usuario
3. Possivel perda de acesso permanente

A solucao e simples: mostre o QR Code **e** um campo de texto na mesma tela. O usuario escaneia, digita o codigo gerado, voce valida. So entao ativa a flag `has_2fa = True` no banco.

## Seguranca do segredo

O segredo OTP e analogo ao "pepper" em hashing de senhas — e um segredo **por usuario**, nao global. Diferente do salt (que pode ser publico), o segredo OTP deve ser protegido:

- Armazenado no banco de dados na tabela de usuarios
- Idealmente criptografado com AES (criptografia de duas vias, porque o servidor precisa ler o segredo para gerar o TOTP)
- Se o banco vazar e os segredos estiverem em plain text, atacantes podem gerar codigos validos

## Problema do relogio

TOTP depende de sincronizacao de tempo entre servidor e dispositivo do usuario. Se o relogio do celular estiver errado por mais de 30 segundos, os codigos nao vao bater. Solucoes:

- A maioria dos authenticators sincroniza com NTP automaticamente
- No servidor, aceitar uma janela de tolerancia (`valid_window=1` aceita o codigo anterior e o proximo, totalizando 90 segundos)
- Alertar o usuario sobre sincronizacao de relogio se validacoes falharem repetidamente

## Custo-beneficio

O instrutor enfatiza: "Vale a pena implementar, cara. E pouquinha implementacao, uma tela a mais, um pouquinho de codigo, vai tornar seu processo de autenticacao muito, muito mais seguro." O esforco e minimo comparado ao ganho de seguranca.