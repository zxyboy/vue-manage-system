export let getRolesByPage = `
       query getRolesByPage($pageInfo : RolePageInfoInput){
          getRolesByPage(pageInfo : $pageInfo) {
            pageNum
            pageSize
            total
            totalPage
            records{
              id
              roleName
              roleDesc
              isShow
              isAdmin
              createTime
              menus{
                id
                title
                index
              }
            }
          }
        }`;

export let updateRole = `
    mutation updateRole($input : RoleUpdateInput){
        updateRole(input : $input){
        id
        
      }
}`;

export let removeRole = `
      mutation removeRole($input : RoleRemoveInput){
        removeRole(input : $input){
        id
        
      }
}
`
export let batchRemoveRole = `
    mutation removeBatchRole($input : [RoleRemoveInput]) {
        removeBatchRole(input: $input) {
            id
            
  }
}
`;

export let createRole = `
      mutation createRole($input : RoleCreateInput){
        createRole(input : $input){
        id
        
      }
}
`;

export let getAllMenus = `
    query getAllMenus{
        getAllMenus{
            id
            title
            index
        }
    }
`;