function InterpretResult(query: string, result: string) -> string {
  client Sonnet
  prompt #"

    You are an AI assistant that interprets the result of a graphql query.
    
    User query:
    {{ query }}

    Database result:
    {{ result}}

    Please answer the user query based on the database result.
  "#
}
  