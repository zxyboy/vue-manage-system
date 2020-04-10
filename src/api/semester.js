export let getSemestersByPage = `
       query getSemestersByPage($pageInfo : SemesterPageInfoInput){
          getSemestersByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage   
            records{
              id
              semester
              createTime
              updateTime
            }
          }
        }`;

export let updateSemester = `
    mutation updateSemester($input : SemesterUpdateInput){
        updateSemester(input : $input){
        id
        semester
      }
}`;

export let removeSemester = `
      mutation removeSemester($input : SemesterRemoveInput){
        removeSemester(input : $input){
        id
        semester
      }
}
`
export  let batchRemoveSemester = `
    mutation removeBatchSemester($input : [SemesterRemoveInput]) {
        removeBatchSemester(input: $input) {
            id
            semester
  }
}
`;

export let createSemester = `
      mutation createSemester($input : SemesterCreateInput){
        createSemester(input : $input){
        id
        semester
      }
}
`;


