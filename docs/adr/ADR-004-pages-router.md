# ADR-004: Next.js Pages Router vs App Router

## Status

Aceito

## Contexto

Next.js oferece dois paradigmas de roteamento:

- **Pages Router**: Tradicional, estavel, usa `getServerSideProps`
- **App Router**: Novo, usa React Server Components (RSC)

## Decisao

Uso o **Pages Router** com `getServerSideProps` para resolucao de tenant server-side.

```typescript
// SSR simples com resolucao de tenant
export const getServerSideProps = withTenant(async (ctx, tenant) => {
  return { customProp: "value" };
});
```

## Justificativa

### Por que Pages Router?

1. **Simplicidade para SSR**
   - `getServerSideProps` é direto
   - Separacao clara entre codigo servidor e cliente
   - Padroes bem documentados

2. **Necessidades de Resolucao de Tenant**
   - Precisamos ler cookies/headers em cada request
   - Pages Router torna isso explicito e simples

3. **Estabilidade**
   - Pages Router e maduro e battle-tested
   - App Router ainda esta evoluindo
   - Menos edge cases e bugs

4. **Familiaridade do Time**
   - Maioria dos desenvolvedores React conhece Pages Router
   - Menor friccao de onboarding

### Por que nao App Router?

1. **Complexidade vs Valor**
   - RSC adiciona complexidade sem beneficio claro para nosso caso de uso
   - Nao temos padroes pesados de data fetching
   - Nossas paginas sao relativamente simples

2. **Desafios de Cache**
   - Cache agressivo do App Router pode conflitar com resolucao de tenant
   - Precisamos de dados frescos de tenant em cada request

3. **Compatibilidade de Bibliotecas**
   - Algumas bibliotecas ainda tem problemas com RSC
   - Solucoes CSS-in-JS requerem tratamento cuidadoso

## Consequencias

### Positivas

- Modelo mental mais simples
- Comportamento server-side previsivel
- Teste facil com `getServerSideProps`
- Amplo suporte da comunidade

### Negativas

- Pode perder otimizacoes futuras de RSC
- Pode requerer migracao depois
- Alguns recursos mais novos do Next.js requerem App Router

## Consideracoes de Migracao

Se migracao para App Router se tornar necessaria:

1. Converter pages para estrutura de diretorio `app/`
2. Substituir `getServerSideProps` por server components
3. Atualizar resolucao de tenant para usar API de headers/cookies
4. Testar comportamento de cache cuidadosamente
