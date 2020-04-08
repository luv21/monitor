const redis = require('redis');
const util  = require('util');
const os = require('os');

class Agent
{
    memoryLoad()
    {
 	// console.log( os.totalmem(), os.freemem() );
       return ((os.totalmem()-os.freemem())/os.totalmem()*100.0).toFixed(2);
    }
}

(async () => 
{
    let args = process.argv.slice(2);
    main(args[0]);

})();




async function main(name)
{
    let agent = new Agent();

    let connection = redis.createClient(6379, '192.168.44.92', {})
    connection.on('error', function(e)
    {
        console.log(e);
        process.exit(1);
    });
    let client = {};
    client.publish = util.promisify(connection.publish).bind(connection);

    // Push update ever 1 second
    setInterval(async function()
    {
        let payload = {
            memoryLoad: agent.memoryLoad()
        };
        let msg = JSON.stringify(payload);
        await client.publish(name, msg);
        console.log(`${name} ${msg}`);
    }, 1000);

    // connection.quit();

}



