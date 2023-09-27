# Nest.js Clean Arch

- Domain
  -> Regras de negócio da aplicação. Comumente desenvolvido apenas com recursos da linguagem utilizada no projeto
  -> No caso do class-validator, é a quebra de regra sobre apenas recursos da linguagem, porem por se tratar de uma lib robusta e muito difundida, ouve esta exceção a regra

  ## Estrutura do projeto

  src
  - shared
    - domain
      - entities -> entidades abstratas
      - error -> abstrações dos errors
      - repositories -> contratos dos repositórios
      - validators -> validadores das entidades
    - infrastructure -> configurações gerais do projeto
    - application
      - providers -> contratos dos providers de libs externas, globais


