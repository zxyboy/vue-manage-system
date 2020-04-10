export let getCoursesByPage = `
       query getCoursesByPage($pageInfo : CoursePageInfoInput){
          getCoursesByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage   
            records{
              id
              courseName
              courseDesc
              orderNum
              createTime
            }
          }
        }`;

export let updateCourse = `
    mutation updateCourse($input : CourseUpdateInput){
        updateCourse(input : $input){
        id
        courseName
      }
}`;

export let removeCourse = `
      mutation removeCourse($input : CourseRemoveInput){
        removeCourse(input : $input){
        id
        courseName
      }
}
`
export let batchRemoveCourse = `
    mutation removeBatchCourse($input : [CourseRemoveInput]) {
        removeBatchCourse(input: $input) {
            id
            courseName
  }
}
`;

export let createCourse = `
      mutation createCourse($input : CourseCreateInput){
        createCourse(input : $input){
        id
        courseName
      }
}
`;
