export let getAllPapersByPage = `
       query getAllPapersByPage($pageInfo : PaperAllPageInfoInput){
          getAllPapersByPage(pageInfo : $pageInfo) {
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
                totalPoints
                creator{
                    id
                    nickname
                    username
                }
                paperTitle
                totalTime
                createTime
                status
                deadline 
                level 
                totalQuestionItemNum
            }
          }
        }`;

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
    }
`;

export let getPaperUserScoresByPaperId = `
    query getPaperUserScoresByPaperId($paperId : Int){
        getPaperUserScoresByPaperId(paperId : $paperId){
            id
            paperId
            user{
                nickname
                username
            }
            checkUser{
                nickname
                username
            }
            userPaperStatus
            scores
            userTotalTime
            createTime
            examStartTime
            examEndTime
            examStartCheckTime
            examEndCheckTime
        }
    }
`;

