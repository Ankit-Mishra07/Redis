const express = require("express")
const redis = require("../configs/redis")

const router = express.Router()

const Product = require("../models/product.model")

router.get("",  (req, res) => {

    redis.get("products", async function(err, prods) {
        
        if(err) { console.log(err) }

        if(prods) {return res.status(200).send(JSON.parse(prods))}

        const products = await Product.find().lean().exec();


          redis.set("products", JSON.stringify(products));
        return res.status(200).send(products)
    })
})


router.post("", async (req, res) => {
    
    const product = await Product.create(req.body)
    const products = await Product.find().lean().exec()

    redis.set("products", JSON.stringify(products))

    return res.status(200).send(product)
})

router.get("/:id", (req, res) => {
    redis.get(`products.${req.params.id}`, async (err, product) => {

        if(err) {console.log(err)}

        if(product) {
            return res.status(200).send({cachedData: JSON.parse(product)})
        }

        const products = await Product.findById(req.params.id).lean().exec()

        redis.set(`products.${req.params.id}`, JSON.stringify(products))

        return res.status(201).send({dbProduct : products})
    })
})


router.patch("/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new :true});

    redis.set(`products.${req.params.id}`, JSON.stringify(product))

    const products = await Product.find().lean().exec()

    redis.set("products", JSON.stringify(products))

    res.status(201).send(product)
})






module.exports = router



//let path = new Array(maze.length).fill(0).map((el) => new Array(maze.length).fill(0))
