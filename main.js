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
let currentIndex = currentBookObject.index - 1 // -1 to match object index to array index
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

function showMonth(object) {
    $('.month').text(object.month)
}

function showBookDetails(object) {
    $('.book-title').html(object.title)
    $('.book-author').html(object.author)
    $('.book-desc').html(object.desc)
}

function showBookImage(object) {
    $('.book-img').attr({
        src: `${object.cover}`,
        alt: `cover artwork for "${object.title}"`
    })
}

function showRecDetails() {
    let formHeader = 'know any good books?'
    $('.rec-title').html(formHeader)
}

function showLoader() {
    setTimeout( () => {
        $('.loader').css({
            "display": "none"
        })
    }, 1000)
}


// ================ ANIMATE

// animate out
function animateMonthOut() {
    $('.month').animate({
        opacity: 0
    }, 500)
}

function animateBookcaseBookOut(object) {
    animateMonthOut()
    $('.book-title, .book-author, .book-desc').animate({
        opacity: 0
    }, 500)
    $('.book-img').animate({
        // animate BOOK IMAGE OUT
    }, 500)
    setTimeout( () => {
        handleBookcaseState(object)
    }, 500)
}

function animateBookcaseRecOut(object) {
    animateMonthOut()
    $('.rec-title, .rec-form-title, .rec-form-author, .rec-submit').animate({
        opacity: 0
    }, 500)
    setTimeout( () => {
        handleBookcaseState(object)
    }, 500)
}

// animate in
function animateMonthIn() {
    $('.month').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, 500)
}

function animateBookcaseBookIn() {
    animateMonthIn()
    $('.book-title, .book-author, .book-desc').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, 500)
    $('.book-img').css({

    }).animate({
        // animate BOOK IMAGE IN
    }, 500)
}

function animateBookcaseRecIn() {
    animateMonthIn()
    $('.rec-title, .rec-form-title, .rec-form-author, .rec-submit').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, 500)
}


// ================ HANDLE

function handleBookcaseState(object) {
    // reset html
    $('.bookcase').html('')
    // if book is found i.e. 'true'
    if (object.book) {
        generateBookHtml()
        showMonth(object)
        showBookDetails(object)
        showBookImage(object)
        animateBookcaseBookIn()
    // if not
    } else {
        generateRecHtml()
        showMonth(object)
        showRecDetails()
        animateBookcaseRecIn()
    }
}

function handleScrollDown() {
    if (currentIndex === 11) {
        return
    } else {
        let currentObject = library[currentIndex]
        currentIndex++
        let nextObject = library[currentIndex] 
        if (currentObject.book) {
            animateBookcaseBookOut(nextObject)
        } else {
            animateBookcaseRecOut(nextObject)
        }
    }
}

function handleScrollUp() {
    if (currentIndex === 0) {
        return
    } else {
        let currentObject = library[currentIndex]
        currentIndex--
        let prevObject = library[currentIndex] 
        if (currentObject.book) {
            animateBookcaseBookOut(prevObject)
        } else {
            animateBookcaseRecOut(prevObject)
        }
    }
}


// ================ WATCH

function watchDesktopScrollTimer(e) {
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
        watchDesktopScroll()
    }, 1250)
}

function watchDesktopScroll () {
    $(scrollTarget).on('wheel', (e) => {
        watchDesktopScrollTimer(e)
    })
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
    watchDesktopScroll()
}


// ================ ON LOAD

$(handleBookcaseState(currentBookObject))
$(showLoader)
$(watchScroll)