let query = {
    query: `{
              getRoleMenus {
                title
                index
                icon
                subs {
                  title
                  index
                  icon
                  subs {
                    title
                    index
                    icon
                  }
                }
              }
            }`
}



export default query