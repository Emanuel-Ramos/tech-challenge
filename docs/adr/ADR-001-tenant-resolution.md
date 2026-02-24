# ADR-001: Estrategia de Resolucao de Tenant

## Status

Accepted

## Contexto

Precisamos de uma forma confiavel de identificar qual tenant esta acessando a plataforma multi-tenant. A solucao deve ser:

- Segura contra ataques de injecao
- SEO-friendly para producao
- Facil de testar durante desenvolvimento
- Persistente entre sessoes do usuario

## Decisao

Implementei uma **resolucao de tenant em tres camadas** com a seguinte prioridade:

1. **Subdominio** (Primario - Producao)
   - `tenant-a.shipay.emanuel.app.br` → `tenant-a`
   - SEO-friendly, separacao clara de marca
   - Cada tenant tem sua propria URL

2. **Cookie Seguro** (Fallback - Persistencia de Sessao)
   - HttpOnly, Secure, SameSite=Strict
   - Permite persistencia de sessao quando subdominio nao esta disponivel
   - Expiracao de 30 dias

3. **Query Parameter** (Apenas Desenvolvimento)
   - `?tenant=tenant-a`
   - Funciona apenas em modo de desenvolvimento
   - Facilita testes locais sem configuracao de DNS

## Medidas de Seguranca

- **Validacao por whitelist**: Apenas tenant IDs pre-aprovados sao aceitos
- **Sanitizacao de input**: Regex remove caracteres especiais
- **Seguranca de cookie**: HttpOnly previne XSS, SameSite previne CSRF

## Consequencias

### Positivas

- Separacao clara entre producao (subdominio) e desenvolvimento (query param)
- Seguro por padrao com multiplas camadas de protecao
- Facil adicionar novos tenants (basta adicionar na whitelist e criar arquivo de config)

### Negativas

- Requer configuracao de DNS wildcard para producao
- Whitelist precisa ser mantida (poderia migrar para banco de dados)

## Implementacao

Veja `apps/shell/src/lib/tenant.ts` para a implementacao completa.
