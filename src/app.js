const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {contractRouter} = require('./routes/contracts-routes');

const app = express();

app.use(bodyParser.json());
app.use('/', contractRouter);
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    if(!contract) return res.status(404).end()
    if(contract.ClientId !== req.profile.id && contract.ContractorId !== req.profile.id) { 
        return res.status(403).end();
    }
    res.json(contract).end();
})
module.exports = app;
