# ADR-006: Versoes Estaveis de Framework (Next.js 14 LTS)

## Status

Aceito

## Contexto

Ao iniciar o projeto, precisavamos decidir quais versoes do Next.js e React usar. As opcoes eram:

1. **Bleeding edge** (Next.js 16, React 19): Recursos mais recentes, mas potencialmente instavel
2. **Estavel/LTS** (Next.js 14, React 18): Battle-tested, amplamente adotado, estavel

## Decisao

Escolhi **Next.js 14.2.x (LTS)** com **React 18.3.x** para este projeto.

## Justificativa

### Por que NAO usar as versoes mais recentes?

| Preocupacao               | Next.js 16 + React 19        | Next.js 14 + React 18           |
| ------------------------- | ---------------------------- | ------------------------------- |
| **Estabilidade**          | Novo, bugs potenciais        | Battle-tested                   |
| **Comunidade**            | Recursos limitados           | Docs/Stack Overflow extensos    |
| **Adocao enterprise**     | Rara                         | Padrao da industria             |
| **Breaking changes**      | Frequentes                   | API estavel                     |
| **Bibliotecas terceiras** | Problemas de compatibilidade | Suporte completo do ecossistema |

### Mentalidade Enterprise

Em ambientes de producao, estabilidade é primordial:

1. **Gestao de Risco**: Novas versoes podem introduzir regressoes
2. **Onboarding de Time**: Mais desenvolvedores estao familiarizados com React 18
3. **Debugging**: Mais conhecimento da comunidade para troubleshooting
4. **Suporte de Longo Prazo**: Versoes LTS recebem patches de seguranca por mais tempo

### O que Ganhamos com Next.js 14

- **Maturidade do App Router**: Server components estaveis (se necessario)
- **Pages Router**: Totalmente suportado, battle-tested
- **Turbopack**: Disponivel para dev (opcional)
- **Patches de seguranca**: Manutencao ativa

## Consequencias

### Positivas

- Comportamento previsivel em producao
- Mais facil contratar desenvolvedores familiarizados com a stack
- Mais respostas no Stack Overflow e tutoriais disponiveis
- Menor risco de encontrar bugs nao documentados

### Negativas

- Perdendo algumas otimizacoes de performance do React Compiler
- Precisara fazer upgrade eventualmente quando Next.js 14 atingir EOL
