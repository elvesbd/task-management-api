# Changelog

## [1.0.0] - 2024-09-28

### Added

- **Autenticação e Autorização**: Implementada autenticação com JWT e autorização baseada em roles (`Admin`, `User`).
- **Gestão de Empresas (Tenants)**:
  - CRUD de empresas, permitindo criar, atualizar, visualizar e excluir.
  - Cada empresa pode gerenciar seus próprios usuários e tarefas de forma isolada.
- **Gestão de Usuários**:
  - Registro de usuários dentro de uma empresa específica.
  - Atribuição de roles (`Admin`, `User`) a usuários.
  - CRUD de usuários (criar, atualizar, visualizar e excluir).
- **Gestão de Tarefas**:
  - CRUD de tarefas com campos de título, descrição, status (`pendente`, `em progresso`, `concluída`) e prazo.
  - Associar cada tarefa a uma empresa específica.

### Fixed

- Ajustes de validação em endpoints de usuários e tarefas para evitar duplicidade de dados.

### Security

- Implementação de proteção de rotas usando **JWT**.
- Controle de permissões baseado em roles para acessar e manipular dados de tarefas e usuários.
