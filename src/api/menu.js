export let getMenusByPage = `
       query getMenusByPage($pageInfo : MenuPageInfoInput){
          getMenusByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage
            records{
              id
              title
              index
              icon
              pid
              orderNum
              parent{
                title
              }
              createTime
            }
          }
        }`;

export let getAllMenus = `
    query getAllMenus{
        getAllMenus{
            id
            title
        }
    }
`;

export let updateMenu = `
    mutation updateMenu($input : MenuUpdateInput){
        updateMenu(input : $input){
        id
  
      }
}`;

export let removeMenu = `
      mutation removeMenu($input : MenuRemoveInput){
        removeMenu(input : $input){
        id
        
      }
}
`
export let batchRemoveMenu = `
    mutation removeBatchMenu($input : [MenuRemoveInput]) {
        removeBatchMenu(input: $input) {
            id
            
  }
}
`;

export let createMenu = `
      mutation createMenu($input : MenuCreateInput){
        createMenu(input : $input){
        id
        
      }
}
`;


