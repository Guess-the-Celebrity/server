if(process.env.NODE_ENV == "development") {
    require('dotenv').config()

}
const app = require('express') ();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000

let count = 0
let limit = 3
let dataQuiz = []
let playerName = []
const stars = [
    {
        id: 0,
        name: 'Brad Pitt',
        image: 'https://image.tmdb.org/t/p/original//kU3B75TyRiCgE270EyZnHjfivoq.jpg'
    },
    {
        id: 1,
        name: 'Keanu Reeves',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rRdru6REr9i3WIHv2mntpcgxnoY.jpg'
    },
    {
        id: 2,
        name: 'Jackie Chan',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/nraZoTzwJQPHspAVsKfgl3RXKKa.jpg'
    },
    {
        id: 3,
        name: 'Dwayne Johnson',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/cgoy7t5Ve075naBPcewZrc08qGw.jpg'
    },
    {
        id: 4,
        name: 'Will Smith',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/eze9FO9VuryXLP0aF2cRqPCcibN.jpg'
    },
    {
        id: 5,
        name: 'Tom Cruise',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/gThaIXgpCm3PCiXwFNDBJCme85y.jpg'
    },
    {
        id: 6,
        name: 'Scarlett Johansson',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3JTEc2tGUact9c0WktvpeJ9pajn.jpg'
    },
    {
        id: 7,
        name: 'Miya Muqi',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/bRnt4FwvIFLXcIBdnZJmUnjbnxj.jpg'
    },
    {
        id: 8,
        name: 'Katheryn Winnick',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/vQSqH3ybDWZHZIqX4NZKhOCXAhQ.jpg'
    },
    {
        id: 9,
        name: 'Alexandra Breckenridge',
        image: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/45f18rm5Zqy0rJaXLYDkQi3Asbc.jpg'
    }
]
// let randomNum = Math.floor(Math.random() * stars.length)
// let randomData = stars[randomNum]
function generateData () {
    let randomNum = Math.floor(Math.random() * stars.length)
    let randomData = stars[randomNum]
    return randomData
}
function generatePerson () {
    dataQuiz = []
    for( let i = 0; i < limit; i++) {
        dataQuiz.push(generateData())
    }
}

io.on('connection', function(socket) {
    // console.log(dataQuiz, '=====')
    generatePerson()
    socket.on('answer', function(payload){
        playerName = payload
        io.emit('serverPass', playerName)
        generateData()
        // socket.emit('init', randomData)
        // console.log(playerName)
        for(let i = 0; i < playerName.length; i++) {
            for (let j = 1; j < limit; j++) {
                if(playerName[i].count == j) {
                    socket.emit('init', dataQuiz[j])
                }
            }
        }
    })
    socket.on('end', function(payload){
        playerName = []
        generatePerson()
        io.emit('gameDone', payload)
    })
    socket.on('inputUsername', function(payload) {
        playerName.push({username: payload, count: 0})
        // for(let i = 0; i < playerName.length; i++) {
        //     if(playerName[i].username === payload) {
        //         socket.emit('init', dataQuiz[playerName[i].count])
        //     }
        // }
        // socket.emit('init', randomData)
        // console.log(dataQuiz)
        socket.emit('init', dataQuiz[0])
        io.emit('addPlayerName', playerName)
    })
})

server.listen(PORT, () => {
    console.log('listening on port '+PORT)
})