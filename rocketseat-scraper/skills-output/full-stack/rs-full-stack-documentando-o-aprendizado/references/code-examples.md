# Code Examples: Documentando o Aprendizado

## Prompt de documentacao (usado na aula)

O instrutor demonstra o seguinte fluxo no modo agente:

### Contexto
- Projeto ja no git com versionamento
- Linhas novas (verdes) indicando codigo novo gerado pela IA
- Historico de chat com contexto da sessao

### Prompt exato usado
```
Faca uma documentacao detalhada do que foi feito aqui,
para que eu possa revisar e aplicar em qualquer outro
momento dos meus estudos.
```

### Comportamento esperado do AI (modo agente)
1. Analisa todo o historico de mudancas
2. Cria documentacao estruturada
3. Salva como arquivo no projeto automaticamente

## Template de documentacao para revisao

```markdown
# Sessao: [Data] - [Feature/Topico]

## O que foi feito
- [Lista do que foi implementado]

## Decisoes tomadas
- [Por que X em vez de Y]
- [Trade-offs considerados]

## Conceitos aplicados
- [Conceito 1]: [Breve explicacao]
- [Conceito 2]: [Breve explicacao]

## Codigo-chave
[Trechos mais importantes com comentarios]

## Para revisar amanha
- [ ] Consigo explicar [conceito 1] sem olhar o codigo?
- [ ] Consigo reescrever [trecho-chave] sozinho?
- [ ] Entendo por que [decisao X] foi tomada?
```

## Template de revisao ativa (dia seguinte)

```markdown
# Revisao: [Data] - [Feature/Topico]

## O que eu lembro (ANTES de ler a doc)
- [Escreva aqui o que lembra]

## Depois de ler a doc
- [ ] Acertei os pontos principais?
- [ ] O que eu esqueci?
- [ ] O que eu entendi errado?

## Tentativa de explicacao
[Explique com suas palavras o que foi feito e por que]

## Reescrita de codigo
[Reescreva o trecho-chave sem copiar]
```

## Fluxo Git com documentacao

```bash
# Apos a IA gerar documentacao
git add src/            # codigo da feature
git add docs/learning/  # documentacao de aprendizado
git commit -m "feat: implementa botao com transicao CSS

docs: adiciona documentacao de aprendizado da sessao"

# No dia seguinte, apos revisao
git add docs/learning/review-[data].md
git commit -m "docs: revisao ativa da sessao anterior"
```

## Exemplo pratico: Feature de botao (mencionado na aula)

### O que o aluno construiu (contexto da aula)
```css
/* Exemplo conceitual do que foi feito */
.button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.button:hover {
  transform: scale(1.05);
}

.panel {
  /* Abre e fecha com transicao */
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.panel.open {
  max-height: 500px;
}
```

### Como o aluno deveria revisar no dia seguinte
```
"Ontem eu fiz um botao que abre e fecha um painel.
Usei CSS transition pra animar a abertura.
O truque foi usar max-height em vez de height
porque height nao anima de 0 para auto.
O border-radius deu o visual arredondado.
A transicao foi 0.3s com ease pra ficar suave."
```

### E depois reescrever o CSS sem olhar o original
Isso cria memoria muscular e revela gaps no entendimento.