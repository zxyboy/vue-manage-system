export let getUsersByPage = `
       query getUsersByPage($pageInfo : UserPageInfoInput){
          getUsersByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage
            records{
              id
              nickname
              username
              gender
              avatarUrl
              birthday
              grade{
                grade
              }
              roles{
                roleName
              }
              lastLoginTime
              children{
                nickname
              }
              parents{
                nickname
              }
              
              createTime
            }
          }
        }`;

export let getAllGrades = `
    query getAllGrades{
        getAllGrades{
            id
            grade
        }
    }    
`;



