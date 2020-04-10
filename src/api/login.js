let loginParam = {
    query: `query login($input: LoginUserInput) {
              login(user: $input) {
                   token
                   username
              }
           }`
}

export default loginParam



