
export let updatePassword = `
    mutation updatePasswordUser($input : UserUpdatePasswordInput){
        updatePasswordUser(input : $input){
            id
        }
    }
`;