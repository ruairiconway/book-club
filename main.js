'use strict'

// Library object array linked from library.js
// i.e. 
// library = [
//     {
//         month: "jan",
//         bookTitle: "human kind: a hopeful history",
//         bookAuthor: "Rutger Bregman",
//         bookDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mattis auctor nibh eget rutrum. Fusce ut dui ultrices, lacinia dolor congue, scelerisque vivamus.",
//         cover: ""
//     }
// ]


// ================ VARIABLES

// scrolling
const bookcase = document.querySelector('.wrapper')
const mc = new Hammer(bookcase)
mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL })


// ================ SCROLLING
function scrollSetup() {
    mc.on("panup", function(e) {
        let scrollDis = e.distance
        if (scrollDis > 50) {
            $('.bookcase').css("background", "red")
        }
    })

    mc.on("pandown", function(e) {
        let scrollDis = e.distance
        if (scrollDis > 50) {
            $('.bookcase').css("background", "yellow")
        }
    })

    $(window).on('wheel', (e) => {
        const scrollYForce = e.originalEvent.deltaY
        if (scrollYForce > 30) {
            console.log('scrolled down')
            $('.bookcase').css("background", "red")
        } else if (scrollYForce < -30) {
            console.log('scrolled up')
            $('.bookcase').css("background", "yellow")
        }
    })
}


// ================ SHOW

function playLoader() {
    setTimeout( () => {
        $('.loader').css("display", "none")
    }, 2000)
}


// ================ ON LOAD

$(playLoader)
$(scrollSetup)