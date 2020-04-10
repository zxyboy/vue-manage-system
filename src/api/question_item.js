export let getQuestionItemsByPage = `
       query getQuestionItemsByPage($pageInfo : QuestionItemPageInfoInput){
          getQuestionItemsByPage(pageInfo : $pageInfo) {
            pageNum
            pageSize
            total
            totalPage
            records{
                id
                courseId
                course {
                    id
                    courseName
                }
                gradeId
                grade{
                    id
                    grade
                } 
                semesterId
                semester{
                    id
                    semester
                }
                chapterId
                chapter {
                    id
                    chapterName
                }
                questionTypeId
                questionType {
                    id
                    questionTypeName
                }
                question
                questionUrl
                optionOne
                optionTwo
                optionThree
                optionFour
                optionFive
                optionSix
                optionSeven
                level
                answerUrl
                answer
                analysis
                createTime
                updateTime
                user {
                    id
                    nickname
                    username
                }
                
            }
          }
        }`;

export let updateQuestionItem = `
    mutation updateQuestionItem($input : QuestionItemUpdateInput){
        updateQuestionItem(input : $input){
        id
        
      }
}`;

export let removeQuestionItem = `
      mutation removeQuestionItem($input : QuestionItemRemoveInput){
        removeQuestionItem(input : $input){
        id
        
      }
}
`
export let batchRemoveQuestionItem = `
    mutation removeBatchQuestionItem($input : [QuestionItemRemoveInput]) {
        removeBatchQuestionItem(input: $input) {
            id
            
  }
}
`;

export let createQuestionItem = `
      mutation createQuestionItem($input : QuestionItemCreateInput){
        createQuestionItem(input : $input){
        id
        
      }
}
`;
export let queryAllOptions = `
    query queryAllOptions{
        getAllGrades{
            id
            grade
        }
        getAllCourses{
            id
            courseName
        }
        getAllSemesters{
            id
            semester
        }
        getAllChapters{
            id
            chapterName
        }
        getAllQuestionTypes{
            id
            questionTypeName
            uniqueType
        }
    }
`;



export let removeImage = `
mutation removeImage($input : ImageRemoveInput){
    removeImage(input : $input){
        id
    }
}
`;