Para usar esse repositório, faça fork no Github, instale dependências usando `npm install`, e então crie uma build de desenvolvimento usando o expo para rodar o app no android ou iphone.

# Pastas Frontend

`src/app/:`
- Contém estrutura de rotas e páginas da aplicação (utilizando a arquitetura App Router). Contém arquivos como page.tsx, layout.tsx, loading.tsx e error.tsx.
- O que fazer aqui: Criar e organizar as telas da aplicação (ex: Dashboard do Aluno, Tela de Fazer Login, Listagem de Treinos, Perfil do Usuário).

`src/components/:`
- Contém componentes visuais reaproveitáveis da interface.
- Exemplos: Botões (Button.tsx), Cards de Treino (ExerciseCard.tsx), Campos de Formulário (Input.tsx), Modais (Modal.tsx), Barras de Navegação (Sidebar.tsx, Header.tsx).
- O que fazer aqui: Construir a biblioteca de componentes visuais do projeto, que serão usados nas telas.

`src/constants/:`
- São valores fixos utilizados na interface gráfica.
- Exemplos: Nomes dos dias da semana, listas de navegação do menu, opções de dropdowns de UI, mensagens estáticas e tokens de temas visuais, como a constante Colors.

`src/hooks/:`
- Deveria conter os Hooks customizados do React (useForm, useWorkout, useAuthModal, useDebounce).
- Serve para isolar a lógica de estado da interface, gerenciamento de formulários, controle de modais e chamadas de busca de dados no lado do cliente.

# Pastas Backend

`src/db/:`
- Configura a conexão com o banco de dados, arquivos de schema (ex: tabelas de Usuários, Treinos, Exercícios, Histórico), arquivos de migração (migrations) e scripts de carga inicial (seeds).
- O que deve ficar aqui: Modelagem do banco de dados, criação e execução de migrações, manutenção do ORM e integridade referencial.

`src/repositories/:`
- O que contém: A camada de acesso direto aos dados (Data Access Layer).
- O que fazer aqui: Escrever as consultas (SQL ou via ORM, como drizzle) para buscar, inserir, atualizar ou remover registros no banco de dados. Exemplo: `UserRepository.ts`, `WorkoutRepository.ts`, `ExerciseRepository.ts`.

`src/services/:`
- O que contém: O coração da aplicação contendo as Regras de Negócio.
- O que deve ficar aqui: Validar regras específicas antes de persistir dados. Exemplo: verificar se um aluno já atingiu o limite de treinos, calcular o progresso semanal de carga, criptografar senhas, validar tokens de autorização e processar regras de agendamento.

`src/utils/:`
- O que contém: Funções utilitárias puras e helpers de apoio ao backend e aplicação geral.
- Exemplos: Gerador de hashes de senha, manipulador e formatador de datas para banco de dados, tratadores globais de exceções/erros HTTP, e validadores de esquemas de dados (ex: Zod / Yup).
