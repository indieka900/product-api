const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find()
    .sort('name')
    .select('name price company')
    res.status(200).json({
        status: "Success",
        nbHits: products.length, 
        products, 
    })
}

const getAllProducts = async (req, res) => {
    const { 
        featured, company,
        name, sort,fields,
        page,limit,numericFilters
     } = req.query
    const  queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    } else if(company){
        queryObject.company = { $regex: company, $options: 'i' }
    } else if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`
        )
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((element) => {
            const [field,operator,value] = element.split('-')
            if (options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        });
    }
    let results = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ') 
        results = results.sort(sortList)
    } else {
        results = results.sort('-createdAt') 
    }
    if(fields){
        const fieldsList = fields.split(',').join(' ') 
        results = results.select(fieldsList)
    }
    
    //console.log(queryObject);

    const pageNo = Number(page) || 1
    const limitV = Number(limit) || 10
    const skip = (pageNo-1) * limitV

    results = results.skip(skip).limit(limitV)
    const products = await results
    res.status(200).json({
        status: "Success",
        nbHits: products.length, 
        products, 
    })
}

module.exports = {
    getAllProductsStatic, getAllProducts
}