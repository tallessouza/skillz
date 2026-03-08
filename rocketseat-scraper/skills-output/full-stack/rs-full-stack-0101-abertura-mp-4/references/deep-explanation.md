# Deep Explanation: API de Sistema de Reembolso

## Contexto do projeto

O instrutor apresenta este projeto como um "bônus" dentro da trilha de Node.js. A motivação é construir algo prático que integre múltiplas funcionalidades comuns em APIs corporativas reais.

## Por que um sistema de reembolso?

O sistema de reembolso é um domínio excelente para aprendizado porque combina naturalmente:

1. **CRUD completo** — solicitações de reembolso passam por criação, listagem, atualização de status e eventual exclusão
2. **Autenticação e autorização em contexto real** — não é apenas "login e pronto", mas controle de acesso por papel (colaborador vs. gestor vs. admin)
3. **Upload de arquivos** — comprovantes fiscais são obrigatórios, forçando o desenvolvedor a lidar com multipart/form-data, validação de tipo e armazenamento
4. **Fluxo de estados** — uma solicitação tem ciclo de vida: rascunho → enviada → em análise → aprovada/rejeitada → reembolsada

## Cenários mencionados pelo instrutor

O instrutor destaca situações reais onde reembolso é necessário:
- **Visita a cliente** — deslocamento, alimentação, hospedagem
- **Participação em palestra** — inscrição, transporte
- **Substituição de peça/equipamento** — compra emergencial em nome da empresa

Cada cenário gera um tipo diferente de comprovante e valor, o que torna o domínio rico para modelagem.

## Decisões arquiteturais implícitas

### API-first
O instrutor deixa claro que esta é uma API que "fornece dados e funcionalidades para uma aplicação front-end". Isso implica:
- Respostas em JSON
- Separação clara entre backend e frontend
- Contratos de API bem definidos

### Multi-empresa
A frase "utilizado por uma empresa ou várias empresas" sugere que o sistema pode evoluir para multi-tenant, onde cada empresa tem seus colaboradores e políticas de reembolso.

### Manipulação de arquivos como feature central
Não é um upload simples — o instrutor enfatiza "receber, validar, manipular". Isso indica que o arquivo passa por pipeline:
1. Recebimento (upload via HTTP)
2. Validação (tipo, tamanho, integridade)
3. Armazenamento (persistência segura)
4. Recuperação (servir o arquivo quando solicitado)

## Habilidades que o projeto desenvolve

Segundo o instrutor, o projeto é uma oportunidade para aprender:
- Autenticação (identificação do usuário)
- Autorização (controle de permissões)
- Banco de dados (persistência e consultas)
- Upload de arquivo (receber via HTTP)
- Validação de arquivo (verificar antes de persistir)
- Manipulação de arquivo (armazenar e servir)

Cada uma dessas habilidades será detalhada nas aulas subsequentes do módulo.