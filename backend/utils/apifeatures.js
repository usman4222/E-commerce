class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        console.log(keyword)
        this.query = this.query.find({ ...keyword })
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key]);


        // let queryStr = JSON.stringify(queryCopy);
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        // Assuming this.query is a valid Mongoose model query
        this.query = this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage) {
        const currentpage = Number(this.queryStr.page) || 1

        const skip = resultPerPage * (currentpage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;
    }

}

module.exports = ApiFeatures;