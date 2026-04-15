# 2QUIP Memory Protocol — Motor de Autossustentabilidade Cognitiva

> **Version:** 1.0.0 | **Created:** 2026-04-14 | **Owner:** Orion Prime
>
> **Objetivo:** Garantir que toda inteligência gerada em uma sessão de trabalho seja persistida, indexada, e reutilizada nas sessões seguintes — criando um ciclo de autossustentabilidade cognitiva.

---

## TL;DR

O sistema 2quip DEVE aprender consigo mesmo. Cada erro, cada decisão, cada padrão descoberto alimenta uma memória central. Antes de agir, consulte. Depois de agir, registre. A inteligência de hoje é a base de amanhã.

---

## 1. Arquitetura de Memória

### 1.1 Camadas de Memória

```
┌─────────────────────────────────────────────┐
│           MEMORY ARCHITECTURE               │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: Pattern Learner (Padrões)         │
│  📁 .aiox-core/data/learned-patterns.yaml   │
│  → Padrões recorrentes, boas práticas       │
│  → Consultado ANTES de cada tarefa          │
│                                             │
│  Layer 2: Entity Registry (Componentes)     │
│  📁 .aiox-core/data/entity-registry.yaml    │
│  → Registro de todos os componentes AIOX    │
│  → Usado pelo IDS para REUSE/ADAPT/CREATE   │
│                                             │
│  Layer 3: Workflow Patterns (Fluxos)        │
│  📁 .aiox-core/data/workflow-patterns.yaml  │
│  → Padrões de workflow bem-sucedidos        │
│  → Templates de fluxo reutilizáveis         │
│                                             │
│  Layer 4: Knowledge Base (Conhecimento)     │
│  📁 .aiox-core/data/aiox-kb.md              │
│  → Base de conhecimento do método AIOX      │
│  → Referência teórica e conceitual          │
│                                             │
│  Layer 5: Workflow Intelligence (Learning)  │
│  📁 .aiox-core/workflow-intelligence/       │
│  → Motor de aprendizado de workflows        │
│  → Learning loop engine                     │
│                                             │
└─────────────────────────────────────────────┘
```

### 1.2 Formato do Pattern Learner

O arquivo `learned-patterns.yaml` segue este formato:

```yaml
patterns:
  - id: PAT-001
    category: architecture | security | performance | workflow | copy | strategy | ux | data
    severity: critical | high | medium | low
    title: "Descrição curta do padrão"
    context: "Quando este padrão se aplica"
    pattern: "O que fazer"
    anti_pattern: "O que NÃO fazer"
    source_agent: "@agent-id"
    discovered_at: "2026-04-14"
    last_validated: "2026-04-14"
    usage_count: 1
    tags: [tag1, tag2]

gotchas:
  - id: GOT-001
    category: same categories as patterns
    severity: critical | high | medium | low
    title: "Descrição do gotcha"
    problem: "O que acontece de errado"
    solution: "Como evitar/corrigir"
    source_agent: "@agent-id"
    discovered_at: "2026-04-14"
    occurrences: 1
    tags: [tag1, tag2]
```

---

## 2. Protocolo de Consulta (PRE-TASK)

### 2.1 Quando Consultar

**OBRIGATÓRIO** — Consultar a memória ANTES de:
- Criar qualquer componente novo (agente, task, workflow, template)
- Modificar componentes existentes
- Tomar decisões de arquitetura
- Iniciar qualquer story
- Auditar segurança
- Criar copy ou estratégia

### 2.2 Como Consultar

```
Comando: *ids check {intent} [--type {type}]

Exemplo:
  *ids check "create auth middleware" --type task
  
Output esperado:
  → REUSE: Existe task similar (auth-guard.md) — reutilizar
  → ADAPT: Existe componente parcial — adaptar
  → CREATE: Nenhum match — criar do zero
```

### 2.3 Consulta ao Pattern Learner

Antes de iniciar uma tarefa, o agente DEVE:

1. Ler `.aiox-core/data/learned-patterns.yaml`
2. Filtrar patterns e gotchas relevantes ao escopo da tarefa
3. Aplicar padrões encontrados
4. Evitar anti-patterns e gotchas documentados

---

## 3. Protocolo de Registro (POST-TASK)

### 3.1 Quando Registrar

**OBRIGATÓRIO** — Registrar na memória DEPOIS de:
- Resolver um bug complexo ou recorrente
- Descobrir um padrão arquitetural bem-sucedido
- Encontrar uma vulnerabilidade de segurança
- Identificar um anti-pattern
- Completar uma story com aprendizados relevantes
- Criar/adaptar um componente significativo
- Configurar infraestrutura ou deployment

### 3.2 Como Registrar

#### Registrar um Padrão:

```
Comando: *memory-add-pattern

Fornecer:
  - category: (architecture | security | performance | workflow | etc)
  - severity: (critical | high | medium | low)
  - title: Descrição curta
  - context: Quando se aplica
  - pattern: O que fazer
  - anti_pattern: O que NÃO fazer
  - tags: [relevantes]
```

#### Registrar um Gotcha:

```
Comando: *memory-add-gotcha

Fornecer:
  - category: (architecture | security | performance | workflow | etc)
  - severity: (critical | high | medium | low)
  - title: Descrição do gotcha
  - problem: O que acontece de errado
  - solution: Como evitar/corrigir
  - tags: [relevantes]
```

#### Registrar Componente no IDS:

```
Comando: *ids register {file-path} [--type {type}] [--agent {agent}]

Exemplo:
  *ids register .aiox-core/development/agents/hacker.md --type agent --agent aiox-master
```

---

## 4. Protocolo de Sincronização de Sessão

### 4.1 Comando de Sync

**AO FINAL DE CADA SESSÃO DE TRABALHO**, o agente ativo DEVE executar:

```
Comando: *memory-sync
```

Este comando executa a seguinte sequência:

1. **Scan de Sessão** — Revisar todas as ações realizadas na sessão
2. **Extração de Aprendizados** — Identificar patterns, gotchas, e decisões significativas
3. **Diff de Conhecimento** — Comparar com `learned-patterns.yaml` existente
4. **Append** — Adicionar novos entries (nunca sobrescrever existentes)
5. **Incrementar Counters** — Atualizar `usage_count` de patterns reutilizados e `occurrences` de gotchas reincidentes
6. **IDS Registry Update** — Registrar novos componentes criados/modificados
7. **Relatório** — Exibir resumo do que foi persistido

### 4.2 Implementação do *memory-sync

O agente DEVE executar os seguintes passos ao receber `*memory-sync`:

```
1. Listar todos os arquivos criados/modificados na sessão
2. Para cada arquivo significativo:
   a. Verificar se existe entry no entity-registry.yaml
   b. Se não existir, criar entry via *ids register
3. Revisar conversação da sessão e extrair:
   a. Decisões de arquitetura → registrar como pattern
   b. Bugs/erros encontrados → registrar como gotcha
   c. Soluções criativas → registrar como pattern
4. Ler learned-patterns.yaml atual
5. Comparar novos aprendizados com existentes:
   a. Se pattern similar existe → incrementar usage_count
   b. Se gotcha similar existe → incrementar occurrences
   c. Se é novo → append ao arquivo
6. Salvar learned-patterns.yaml atualizado
7. Exibir relatório:
   - Patterns adicionados: N
   - Gotchas adicionados: N
   - Patterns reforçados: N
   - Componentes registrados: N
```

---

## 5. Integração com IDS (Incremental Decision System)

### 5.1 Fluxo IDS + Memory

```
                    PRE-TASK
                       │
          ┌────────────▼────────────┐
          │   *ids check {intent}   │
          │   Consultar Registry    │
          └────────────┬────────────┘
                       │
          ┌────REUSE───┼───ADAPT───┐───CREATE──┐
          │            │           │            │
          ▼            ▼           ▼            ▼
     Reutilizar    Adaptar     Criar novo   Consultar
     existente     existente   componente   Pattern Learner
          │            │           │            │
          └────────────┼───────────┘            │
                       │                        │
                       ▼                        ▼
               EXECUTAR TAREFA ◄───── Aplicar patterns
                       │
                       ▼
                  POST-TASK
                       │
          ┌────────────▼────────────┐
          │    *memory-sync         │
          │    Registrar learning   │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │   *ids register         │
          │   Registrar componente  │
          └─────────────────────────┘
```

### 5.2 Comandos IDS Disponíveis

| Comando | Descrição |
|---------|-----------|
| `*ids check {intent}` | Verificar Registry antes de criar |
| `*ids impact {entity}` | Análise de impacto (quem depende?) |
| `*ids register {path}` | Registrar componente novo |
| `*ids health` | Health check do Registry |
| `*ids stats` | Estatísticas do Registry |

---

## 6. Regras de Ouro

### 6.1 Para Todos os Agentes

1. **NUNCA** criar algo sem antes consultar `*ids check`
2. **NUNCA** encerrar sessão sem executar `*memory-sync`
3. **NUNCA** ignorar um gotcha documentado — se o problema reapareceu, a solução anterior falhou e precisa ser atualizada
4. **SEMPRE** comparar novos materiais com conhecimento existente
5. **SEMPRE** documentar a razão por trás de decisões, não apenas a decisão em si

### 6.2 Para Orion Prime

Como orquestrador, Orion Prime tem responsabilidades adicionais:

1. Garantir que agentes especializados consultam a memória
2. Executar `*memory-sync` ao final de sessões de orquestração
3. Mediar conflitos entre patterns de diferentes agentes
4. Manter a integridade do entity-registry
5. Periodic health check: `*ids health`

### 6.3 Para Novos Agentes

Ao integrar um novo agente (ex: video-editor, photographer):

1. O novo agente DEVE ter `learned-patterns.yaml` em suas dependencies
2. O novo agente DEVE incluir consulta ao Pattern Learner em seu core_principles
3. O template de agent DEVE incluir referência a este Memory Protocol
4. Registrar o novo agente via `*ids register`

---

## 7. Evolução do Protocolo

Este protocolo é vivo. Ele evolui com o ecossistema.

### 7.1 Quando Atualizar Este Documento

- Quando uma nova camada de memória é adicionada
- Quando o formato do Pattern Learner muda
- Quando novos comandos de memória são criados
- Quando novos tipos de agentes são integrados

### 7.2 Versionamento

Segue o mesmo padrão da Constitution:
- **MAJOR:** Nova camada de memória ou mudança no fluxo principal
- **MINOR:** Novos comandos ou categorias
- **PATCH:** Clarificações e refinamentos

---

## References

- **Constitution:** `.aiox-core/2quip-constitution.md`
- **Pattern Learner:** `.aiox-core/data/learned-patterns.yaml`
- **Entity Registry:** `.aiox-core/data/entity-registry.yaml`
- **Workflow Patterns:** `.aiox-core/data/workflow-patterns.yaml`
- **Knowledge Base:** `.aiox-core/data/aiox-kb.md`
- **Workflow Intelligence:** `.aiox-core/workflow-intelligence/`
- **IDS Governor Task:** `.aiox-core/development/tasks/ids-governor.md`

---

*2quip Memory Protocol v1.0.0*
*Consulte → Execute → Registre → Evolua*
