# Code Examples: Hardware e Software

## Nota sobre esta aula

Esta e uma aula **puramente conceitual** — nao ha codigo no transcript. Os exemplos abaixo ilustram as camadas discutidas, traduzindo os conceitos em cenarios concretos que um programador web encontrara.

## Camada 1: Hardware (o que voce toca)

```
Dispositivos de entrada:    teclado, mouse, camera, microfone, touchscreen
Dispositivos de saida:      monitor, impressora, caixas de som
Armazenamento:              HD, SSD, pendrive, cartao SD
Processamento:              CPU, GPU, RAM
Conectividade:              placa de rede, placa Wi-Fi, Bluetooth
```

## Camada 2: Software de sistema (sistema conversando com sistema)

```
Sistema Operacional:        Windows, macOS, Linux
Drivers:                    driver de video, driver de impressora, driver de rede
Firmware:                   BIOS/UEFI, firmware da impressora
Servicos de background:     gerenciador de memoria, escalonador de processos
```

### Exemplo: o que acontece quando voce digita uma tecla

```
[Teclado (hardware)]
    → sinal eletrico enviado via USB
    → [Driver do teclado (software)]
        → traduz scan code para caractere
        → [Sistema Operacional (software)]
            → encaminha evento para o programa ativo
            → [Navegador Chrome (programa/app)]
                → exibe a letra na tela
```

### Exemplo: o que acontece quando voce clica em "Imprimir"

```
[Usuario clica "Imprimir" no navegador (programa/app)]
    → [Sistema Operacional (software)]
        → [Spooler de impressao (software)]
            → [Driver da impressora (software)]
                → [Impressora (hardware)]
                    → imprime o documento
```

## Camada 3: Programas / Apps (o que o programador web constroi)

### Exemplos citados na aula

| Programa | Tipo | Plataforma |
|----------|------|-----------|
| Chrome | Navegador web | Desktop/Mobile |
| Firefox | Navegador web | Desktop/Mobile |
| Edge | Navegador web | Desktop/Mobile |
| Safari | Navegador web | Apple devices |
| WhatsApp | Mensagens | Mobile/Web |
| Instagram | Rede social | Mobile/Web |
| Google Search | Buscador | Web |

### O que voce vai construir na programacao web

```
Frontend (interface do usuario):
    - Paginas web (HTML/CSS/JS)
    - Single Page Applications (React, Vue, Angular)
    - Progressive Web Apps (PWAs)

Backend (logica no servidor):
    - APIs REST / GraphQL
    - Autenticacao e autorizacao
    - Processamento de dados

Full Stack (ambos):
    - Aplicacoes completas acessiveis pelo navegador
    - Apps que o usuario abre, interage, e usa pela internet
```

### Analogia visual: onde o programador web atua

```
┌─────────────────────────────────────────────┐
│  HARDWARE (fisico)                          │
│  ┌───────────────────────────────────────┐  │
│  │  SOFTWARE DE SISTEMA (invisivel)      │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  PROGRAMAS / APPS              │  │  │
│  │  │  ← VOCE CONSTROI AQUI         │  │  │
│  │  │                                 │  │  │
│  │  │  Chrome, WhatsApp, Instagram   │  │  │
│  │  │  Seu proximo projeto web!      │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```