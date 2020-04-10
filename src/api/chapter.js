export let getChaptersByPage = `
       query getChaptersByPage($pageInfo : ChapterPageInfoInput){
          getChaptersByPage(pageInfo : $pageInfo) {
                pageNum
                pageSize
                total
                totalPage   
            records{
              id
              chapterName
              orderNum
              createTime
            }
          }
        }`;

export let updateChapter = `
    mutation updateChapter($input : ChapterUpdateInput){
        updateChapter(input : $input){
        id
        chapterName
      }
}`;

export let removeChapter = `
      mutation removeChapter($input : ChapterRemoveInput){
        removeChapter(input : $input){
        id
        chapterName
      }
}
`
export let batchRemoveChapter = `
    mutation removeBatchChapter($input : [ChapterRemoveInput]) {
        removeBatchChapter(input: $input) {
            id
            chapterName
  }
}
`;

export let createChapter = `
      mutation createChapter($input : ChapterCreateInput){
        createChapter(input : $input){
        id
        chapterName
      }
}
`;


