export let getQuestionTypesByPage = `
       query getQuestionTypesByPage($pageInfo : QuestionTypePageInfoInput){
          getQuestionTypesByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage
            records{
              id
              questionTypeName
              uniqueType
              isObjective
              adviceDuration
              orderNum
              createTime
            }
          }
        }`;

export let updateQuestionType = `
    mutation updateQuestionType($input : QuestionTypeUpdateInput){
        updateQuestionType(input : $input){
        id
      }
}`;

export let removeQuestionType = `
      mutation removeQuestionType($input : QuestionTypeRemoveInput){
        removeQuestionType(input : $input){
        id
      }
}
`
export let batchRemoveQuestionType = `
    mutation removeBatchQuestionType($input : [QuestionTypeRemoveInput]) {
        removeBatchQuestionType(input: $input) {
            id
  }
}
`;

export let createQuestionType = `
      mutation createQuestionType($input : QuestionTypeCreateInput){
        createQuestionType(input : $input){
        id
      }
}
`;


