const {request, response} = require('express');

const users = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
    {id: 3, name: 'Bob Smith'},
];

const getMessage = (req = request, res = response) => {
    res.send("Hello from the user controller!");
}

const getAllUsers = (req = request, res = response) => {
    res.send(users);
}

const getById = (req = request, res = response) => {
    const { id } = req.params;

    if(isNaN(id)){
        res.status(400).send("User id not valid");
        return;
    }

    const user = users.find(user => user.id === +id);

    if(!user){
        res.status(404).send("id not found");
        return;
    }

    res.send(user);

}

module.exports = {getAllUsers, getById,getMessage};