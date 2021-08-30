const express = require('express');
const amqp = require('amqplib');
const app = express();

let channel, connection;

connect();
async function connect() {
    try {
        const amqpServer = 'amqp://localhost:5672';
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue('rabbit');
        await channel.consume('rabbit', data => {
            console.log(`Received: \n=>${Buffer.from(data.content)}`);
        })

        await channel.ack(data)
    } catch (error) {
        if(error) {
            console.error(`%c Error occured: ${error}`, 'color:orange')
        }
    }

}

app.get('/send', async (req, res) => {
    res.status(200).json({
        message: 'Sent'
    })
})
app.listen(3002, () => {
    console.log(`Server of service 1 started on port 3002`);
})