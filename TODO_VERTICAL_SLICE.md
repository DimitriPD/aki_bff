# Plano de Migração para Vertical Slice

## 1. Identificar e remover/desabilitar camadas globais
- [ ] Remover pasta `domain/` (entities, interfaces, dto)
- [ ] Remover pasta `application/use-cases/`
- [ ] Remover pasta `interface/controllers/`
- [ ] Remover pasta `interface/routes/`
- [ ] Remover middlewares não transversais
- [ ] Remover/ajustar pasta `shared/` para conter apenas utilitários realmente globais

## 2. Refatorar cada slice em `features/`
- [ ] Para cada slice (ex: attendances, events, classes, students, teachers):
    - [ ] Mover use cases, DTOs, entidades, validações, handlers para dentro do slice
    - [ ] Criar/ajustar handler/controller local
    - [ ] Criar/ajustar rotas locais
    - [ ] Adicionar testes co-localizados

## 3. Ajustar ponto de entrada
- [ ] Refatorar `src/index.ts` para importar e registrar rotas dos slices

## 4. Validar funcionamento
- [ ] Garantir que o projeto compila
- [ ] Garantir que as rotas principais funcionam

## 5. Limpeza final
- [ ] Remover arquivos/pastas obsoletos
- [ ] Atualizar documentação
