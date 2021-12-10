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





module.exports = router



//let path = new Array(maze.length).fill(0).map((el) => new Array(maze.length).fill(0))
