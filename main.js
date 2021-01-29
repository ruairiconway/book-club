'use strict'

// Library object array linked from library.js
/*
library = [
    {
         month: "jan",
         book: true,
         title: "human kind: a hopeful history",
         author: "Rutger Bregman",
         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mattis auctor nibh eget rutrum. Fusce ut dui ultrices, lacinia dolor congue, scelerisque vivamus.",
         cover: "./assets/human-kind.jpg"
    }
]
*/

// ================ VARIABLES

// scrolling target
const scrollTarget = '.bookcase'
const scrollTargetMobile = document.querySelector(scrollTarget)
// current date/library object
const currentMonthNum = new Date().getMonth()
const currentBookObject = library[currentMonthNum]
// handle slide
let currentIndex = currentBookObject.index


// ================ GENERATE

function generateBookcaseTitle() {
    let divTitle = $('<div>').addClass('bookcase-title')
    $('.bookcase').prepend(divTitle)
    let h2Title = $('<h2>').addClass('month')
    $('.bookcase-title').append(h2Title)
}

function generateBookHtml() {
    generateBookcaseTitle()
    // bookcase-book div append to bookcase
    let divBook = $('<div>').addClass('bookcase-book')
    $('.bookcase').append(divBook)
    // book details append to bookcase-book
    let pTitle = $('<p>').addClass('book-title')
    let pAuthor = $('<p>').addClass('book-author')
    let imgCover = $('<img>').addClass('book-img')
    let pDesc = $('<p>').addClass('book-desc')
    $('.bookcase-book').append(pTitle, pAuthor, imgCover, pDesc)
}

function generateRecHtml() {
    generateBookcaseTitle()
    // bookcase-rec div append to bookcase
    let divRec = $('<div>').addClass('bookcase-rec')
    $('.bookcase').append(divRec)
    // rec title + form append to bookcase-rec
    let pRec = $('<p>').addClass('rec-title')
    let formRec = $('<form>').addClass('rec-form')
    $('.bookcase-rec').append(pRec, formRec)
    // form details append to rec-form
    let inputTitle = $('<input>').attr({
        type: "text",
        name: "rec-form-title",
        id: "rec-form-title",
        placeholder: "title..",
        "aria-label": "book title" 
    }).addClass('rec-form-author')
    let inputAuthor = $('<input>').attr({
        type: "text",
        name: "rec-form-author",
        id: "rec-form-author",
        placeholder: "author..",
        "aria-label": "book author" 
    }).addClass('rec-form-author')
    let buttonSub = $('<button>').attr({
        type: "submit",
        value: "share"
    }).addClass('rec-submit').text('share')
    $('.rec-form').append(inputTitle, inputAuthor, buttonSub)
}


// ================ SHOW

function showBook(object) {
    $('.book-title').html(object.title)
    $('.book-author').html(object.author)
    $('.book-img').attr({
        src: `${object.cover}`,
        alt: `cover artwork for "${object.title}"`
    }).html()
    $('.book-desc').html(object.desc)
}

function showRec() {
    let formHeader = 'know any good books?'
    $('.rec-title').html(formHeader)
}


// ================ HANDLE

function handleBookcase(object) {
    // if a book is filled in for that month
    $('.bookcase').html('')
    if (object.book) {
        generateBookHtml()
        showBook(object)
    } else {
        generateRecHtml()
        showRec()
    }
    $('.month').text(object.month)
}

function handleScrollDown() {
    if (currentIndex === 11) {
        return
    } else {
        currentIndex = currentIndex + 1
        let newObject = library[currentIndex]
        handleBookcase(newObject)
    }
    console.log(currentIndex)
}

function handleScrollUp() {
    if (currentIndex === 0) {
        return
    } else {
        currentIndex = currentIndex - 1
        let newObject = library[currentIndex]
        handleBookcase(newObject)
    }
    console.log(currentIndex)
}

// ================ WATCH

function watchScroll() {
    // touch / mobile
    const mc = new Hammer(scrollTargetMobile)
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL })
    mc.on("panup", function(e) {
        // execute on scroll DOWN
        let scrollDis = e.distance
        if (scrollDis > 50) {
            handleScrollDown()
        }
    })
    mc.on("pandown", function(e) {
        // execute on scroll UP
        let scrollDis = e.distance
        if (scrollDis > 50) {
            handleScrollUp()
        }
    })
    // wheel / desktop
    $(scrollTarget).on('wheel', (e) => {
        const scrollY = e.originalEvent.deltaY
        if (scrollY > 30) {
            // execute on scroll DOWN
            handleScrollDown()
        } else if (scrollY < -30) {
            // execute on scroll UP
            handleScrollUp()
        }
    })
}


// ================ SHOW

function playLoader() {
    setTimeout( () => {
        $('.loader').css("display", "none")
    }, 1000)
}


// ================ ON LOAD

$(playLoader)
$(watchScroll)
$(handleBookcase(currentBookObject))