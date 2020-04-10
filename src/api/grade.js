export let getGradesByPage = `
       query getGradesByPage($pageInfo : GradePageInfoInput){
          getGradesByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage   
            records{
              id
              grade
              orderNum
              courses{
                id
                courseName
                courseDesc
                orderNum
              }
              createTime
            }
          }
        }`;

export let updateGrade = `
    mutation updateGrade($input : GradeUpdateInput){
        updateGrade(input : $input){
        id
        grade
      }
}`;

export let removeGrade = `
      mutation removeGrade($input : GradeRemoveInput){
        removeGrade(input : $input){
        id
        grade
      }
}
`
export let batchRemoveGrade = `
    mutation removeBatchGrade($input : [GradeRemoveInput]) {
        removeBatchGrade(input: $input) {
            id
            grade
  }
}
`;

export let createGrade = `
      mutation createGrade($input : GradeCreateInput){
        createGrade(input : $input){
        id
        grade
      }
}
`;

export let getAllCourses = `
    query getAllCourses{
        getAllCourses {
            id
            courseName
            courseDesc
            orderNum
        }
    }
`;