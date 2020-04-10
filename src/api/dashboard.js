let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
export let indexStatQuery = `
    query indexStat{
        indexStat{
            totalUserNum 
            totalPaperNum 
            totalTestTime 
            testingUserNum 
            checkingUserNum 
            todaySignNum 
        }
        
       userAgeStat{
        ageRange
        ageNum
        }
       userProvinceNumStat{
            name
            value
        }
        
       userGenderStat{
            gender
            genderNum
        }
       totalMonthStat(year: ${year}, month: ${month}) {
            id
            today
            userNum
            paperNum
            examNum
            totalExamTime
            signNum
            noteNum
            createTime
        }
        growthMonthStat(year: ${year}, month: ${month}) {
            id
            today
            userNum
            paperNum
            examNum
            totalExamTime
            signNum
            noteNum
            createTime
        }
    }

`;

