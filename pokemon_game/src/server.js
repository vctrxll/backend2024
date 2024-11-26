const express = require('express');

class Server {
    constructor() {
        this.app = express();
        this.port = 3000;

    }
    middleware() {
        this.app.use(express.json());
    }

    routes(){

    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Server listening on port: ${this.port}`);
        });
    }
}
module.exports = Server; 
