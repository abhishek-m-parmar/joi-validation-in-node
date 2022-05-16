const express = require('express')
const Joi = require('joi')
const app = express()
const port = 3002
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const validationmiddleware = (req,res,next)=>{
    const schema = Joi.object().keys({
        name:Joi.string().required(),
        srch:Joi.string().optional(),
        category: Joi.string().optional().valid("car", "bike"),
        amount: Joi.number().integer().min(1).max(20),
        age: Joi.number.when('name',{is : 'test',then: Joi.required(), otherwise: Joi.optional()}),
        item: Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string.required()
        }),
        email: Joi.string.email({
            minDomainSegments:2,
            tlds:{allow:["com", "in"]}
        }),
        customname: Joi.string().custom((value, msj)=>{
            if(value=='test')
            {
                return msj.message("not allow test name");
            }
            return true
        }),
        price: Joi.alternatives().try(JOi.number(), null)

    }).unknown(true)

    const {error} = schema.validate(req.body, {abortEarly:false});
    if(error){
        res.status(200).json({error : error})
    }
    else{
        next();
    }
}

app.post('/add-user',validationmiddleware, async (req,res)=>{
    let result = {
        id: 12,
        name: 'test Demo'
    }
    res.status(200).json(req.body)
})


app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
})
