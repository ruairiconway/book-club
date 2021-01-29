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

// date/library object
const currentMonthNum = new Date().getMonth()
const currentBookObject = library[currentMonthNum]
// navigation
const scrollTarget = '.bookcase'
const scrollTargetMobile = document.querySelector(scrollTarget)
const mc = new Hammer(scrollTargetMobile)
let currentIndex = currentBookObject.index - 1
// form
const formEndpoint = 'https://formspree.io/f/xleovrdl'


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
    let formRec = $('<form>').attr({
        action: `${formEndpoint}`,
        method: 'POST'
    }).addClass('rec-form')
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
        currentIndex++
        let newObject = library[currentIndex]
        handleBookcase(newObject)
    }
}

function handleScrollUp() {
    if (currentIndex === 0) {
        return
    } else {
        currentIndex--
        let newObject = library[currentIndex]
        handleBookcase(newObject)
    }
}


// ================ WATCH

function watchScrollDesktop(e) {
    $(scrollTarget).off('wheel')
    const scrollY = e.originalEvent.deltaY
    if (scrollY > 0) {
        // execute on scroll DOWN
        handleScrollDown()
    } else if (scrollY < 0) {
        // execute on scroll UP
        handleScrollUp()
    }
    setTimeout( () => {
        $(scrollTarget).on('wheel', (e) => {
            watchScrollDesktop(e)
        })
    }, 1250)
}

function watchScroll() {
    // touch / mobile
    mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL })
    mc.on('swipeup', () => {
        // execute on scroll DOWN
        handleScrollDown()
    })
    mc.on('swipedown', () => {
        // execute on scroll UP
        handleScrollUp()
    })
    // wheel / desktop
    $(scrollTarget).on('wheel', (e) => {
        watchScrollDesktop(e)
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