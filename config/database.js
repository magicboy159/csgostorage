var url = 'mongodb://localhost/csgostorage';

if(process.env.MONGO_URL) {
    url = 'mongodb://magicboy159:Pluisje20088!@ds151661.mlab.com:51661/csgostorage';
}

module.exports = {
    url: url
}