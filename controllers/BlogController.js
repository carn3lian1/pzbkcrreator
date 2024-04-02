exports.articleList = async (request, response, next) => {

    try {

        response.status(200).render("blog_article_list")

    } catch (error) {

    }


}