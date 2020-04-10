export let getUserInfo = `
       query getUserInfo{
          getUserInfo{
            username
            roles{
                id
                roleName
                roleDesc
            }
            lastLoginTime
            loginTime
            email
            avatarUrl
          }
        }`;

export let updateAvatarUrl = `
    mutation updateAvatarUrl($avatarUrl : String){
        updateAvatarUrl(avatarUrl : $avatarUrl){
            id
        }
        
        
    }

`;
export let updateUser = `
    mutation updateUser($input : UserUpdateInput){
        updateUser(input : $input){
            id
        }
    }
`;