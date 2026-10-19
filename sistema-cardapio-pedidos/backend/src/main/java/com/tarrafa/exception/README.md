## Motivo
Essa pasta contém as exceções e o tratamento centralizado de erros da aplicação, ou seja, define como o sistema reage quando ocorre um problema durante uma operação. Ela permite identificar situações como recursos não encontrados, violações de regras de negócio e erros de validação, devolvendo respostas HTTP padronizadas para o frontend.

Dessa forma, os controllers e serviços não precisam repetir o mesmo código de tratamento de erros em diferentes partes da aplicação.

## Arquivos

`RecursoNaoEncontradoException` - representa uma exceção utilizada quando um recurso solicitado não é encontrado, como um produto, uma categoria ou um pedido inexistente.

`RegraNegocioException` - representa uma exceção utilizada quando uma operação não pode ser realizada por violar alguma regra de negócio do sistema.

`GlobalExceptionHandler` - é responsável por capturar as exceções tratadas pela aplicação e convertê-las em respostas HTTP com mensagens de erro em formato JSON, utilizando o campo `mensagem`.

## Tratamento de erros
O `GlobalExceptionHandler` centraliza o tratamento de diferentes tipos de exceção e devolve os códigos HTTP correspondentes:

- `RecursoNaoEncontradoException` - retorna `404 Not Found`, indicando que o recurso solicitado não foi encontrado.
- `RegraNegocioException` - retorna `400 Bad Request`, indicando que a operação não pode ser realizada conforme as regras do sistema.
- `MethodArgumentNotValidException` - retorna `400 Bad Request` quando os dados recebidos não passam pelas validações dos DTOs, utilizando a primeira mensagem de validação.
- `ResponseStatusException` - preserva o status HTTP definido pela exceção e utiliza sua razão como mensagem de erro.

As respostas utilizam o campo `mensagem` para informar o motivo do erro ao frontend. Por exemplo:

```json
{
  "mensagem": "Produto não encontrado"
}
```

O texto apresentado depende da exceção lançada e da mensagem definida pela aplicação.

## Como funciona
Quando ocorre uma situação que impede a execução de uma operação, um serviço pode lançar uma exceção específica. O `GlobalExceptionHandler`, utilizando a anotação `@RestControllerAdvice`, identifica as exceções para as quais possui um tratamento definido e transforma essas situações em respostas HTTP padronizadas.

Assim, o frontend consegue receber informações sobre o erro e apresentar uma mensagem adequada, enquanto o backend mantém o tratamento centralizado em um único lugar.
