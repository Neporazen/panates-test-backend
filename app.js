const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

let db = require('./db');

function compareList(a, b) {
    const dateA = a.last_scraped;
    const dateB = b.last_scraped;
  
    let comparison = 0;
    if (dateA < dateB) {
      comparison = 1;
    } else if (dateA > dateB) {
      comparison = -1;
    }
    return comparison;
  }

const main = async () => {
  const {
    app
  } = createServer()

  app.get('/', (req, res) => {
      res.status(200).json({
          success: true,
      })
  })

  app.get('/test', async (req, res) => {
      try{
        const col = await db();
        const result = await col.findOne({
            _id: '10084023',
        });
        res.status(200).json(result);
      } catch (err) {
          console.log(err.stack);
          res.status(400).json({
              err: err.stack,
          })
      }
  })

  app.post('/list', async (req, res) => {
    const { startDate, endDate } = req.body;

    try{
      const col = await db();
     
      let result = await col.find({
          last_scraped: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
          },
      }).toArray();
      result = result.sort(compareList);
      res.status(200).json({
          code: 0,
          message: "Success",
          count: result.length,
          records: result.map(item => ({
              _id: item._id,
              name: item.name,
          }))
      });
    } catch (err) {
        console.log(err.stack);
        res.status(400).json({
            code: 1,
            message: err.stack,
        })
    }
})

app.post('/content', async (req, res) => {
    const { _id } = req.body;

    try{
      const col = await db();
     
      let result = await col.findOne({
          _id: _id,
      });
      res.status(200).json({
          code: 0,
          message: "Success",
          records: [{
              _id: result._id,
              name: result.name,
              accommodates: result.accommodates,
              bedrooms: result.bedrooms,
              beds: result.beds,

          }],
      });
    } catch (err) {
        console.log(err.stack);
        res.status(400).json({
            code: 1,
            message: err.stack,
        })
    }
})
}

const createServer = () => {

  const PORT = process.env.PORT || 3000
  const configurations = {
  // Note: You may need sudo to run on port 443
    production: { ssl: false, port: PORT, hostname: 'example.com' },
    development: { ssl: false, port: PORT, hostname: 'localhost' },
  }
  const environment = (process.env.NODE_ENV || 'development')
  const config = configurations[environment]


  // Express Config
  // Create a web server to serve files
  const app = express()
  // app.use(express.static('static'))
  // app.use(cors({origin: '*'}))
  app.use(cors())
  app.use(bodyParser.json())



  // Create the HTTPS or HTTP server, per configuration
  const server = http.createServer(app)
  // if (config.ssl) {
  // // Assumes certificates are in .ssl folder from package root. Make sure the files
  // // are secured.
  //   server = https.createServer(
  //     {
  //       key: fs.readFileSync(`./ssl/${environment}/server.key`),
  //       cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
  //     },
  //     app,
  //   )
  // } else {
  //   server = http.createServer(app)
  // }
  server.listen({
    port: config.port,
  }, () => console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port} `,
  ))
  return {
    server,
    app
  }
}
main().catch((e) => console.error(e))