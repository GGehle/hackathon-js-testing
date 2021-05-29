const Ctl = require('ipfsd-ctl')

const port = 9090
const server = Ctl.createServer(port, {
    ipfsModule: require('ipfs'),
    ipfsHttpModule: require('ipfs-http-client')
},
{
    js: {
        ipfsBin: 'path/js/ipfs/bin'
    },
    go: {
        ipfsBin: 'path/go/ipfs/bin'
    },
})
const factory = Ctl.createFactory({
    ipfsHttpModule: require('ipfs-http-client'),
    remote: true,
    endpoint: `http://localhost:${port}` // or you can set process.env.IPFSD_CTL_SERVER to http://localhost:9090
})

await server, async (err)=>{
    if (err) {
        console.log('Error: failed to start server');
        return res.status(500).send(err);
    }
    });
.start()
const ipfsd = await factory.spawn()
const id = await ipfsd.api.id()

console.log(id)

await ipfsd.stop()
await server.stop()

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const OrbitDB = require('orbit-db')

const Ctl = require('ipfsd')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.get('/', (req, res) => {
        res.render('home');
});

app.post('/upload',(req, res) => {
    const file = req.files.file;
    const fileName = req.body.fileName;
    const filePath = 'files/' + fileName;

    file.mv(filePath, async (err)=>{
        if (err) {
            console.log('Error: failed to download the file');
            return res.status(500).send(err);
        }
        
        const fileHash = await addFile(filename, filepath);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });
        
        res.render('upload', { fileName, fileHash});
        });
    });

const addFile = async (fileName, filePath) => {
        const file = fs.readFileSync(filePath);
        const fileAdded = await ipfs.add({path: fileName, content: file});
        const fileHash = fileAdded[0].hash;

        return fileHash;
};

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});