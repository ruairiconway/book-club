'use strict'

// Library object array linked from library.js

// ================ VARIABLES
// timers
// == loader
const loaderDuration = 1500
const loaderFadeInTime = 750
// == scroll
const scrollWatchDelay = 1250
// == animate
const animateOutMax = 700 // has to be >= than the rest. It's when handleBookcaseState() kicks in.
const animateMonthTime = 350
const animateContentTime = 700
const animateImgTime = 500
const animateFormTime = 500
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
    let h2Title = $('<h2>').addClass('month')
    $('.bookcase').append(h2Title)
}

function generateBookHtml() {
    generateBookcaseTitle()
    // book details append to bookcase
    let pTitle = $('<p>').addClass('book-title')
    let pAuthor = $('<p>').addClass('book-author')
    let imgCover = $('<img>').addClass('book-img')
    let pDesc = $('<p>').addClass('book-desc')
    $('.bookcase').append(pTitle, pAuthor, imgCover, pDesc)
}

function generateRecHtml() {
    generateBookcaseTitle()
    // rec title + form append to bookcase
    let pRec = $('<p>').addClass('rec-title')
    let formRec = $('<form>').attr({
        action: `${formEndpoint}`,
        method: 'POST'
    }).addClass('rec-form')
    $('.bookcase').append(pRec, formRec)
    // form details append to rec-form
    let inputTitle = $('<input>').attr({
        type: "text",
        name: "rec-form-title",
        id: "rec-form-title",
        placeholder: "title..",
        "aria-label": "book title",
        required: true
    }).addClass('rec-form-author')
    let inputAuthor = $('<input>').attr({
        type: "text",
        name: "rec-form-author",
        id: "rec-form-author",
        placeholder: "author..",
        "aria-label": "book author",
        required: true
    }).addClass('rec-form-author')
    let buttonSub = $('<button>').attr({
        type: "submit",
        value: "share"
    }).addClass('rec-submit').text('share')
    $('.rec-form').append(inputTitle, inputAuthor, buttonSub)
}


// ================ ANIMATE

// loader
function animateLoader() {
    $('.loader-title').animate({
        opacity: 1
    }, loaderFadeInTime, "swing")
}

// month
function animateMonthOut() {
    $('.month').animate({
        opacity: 0
    }, animateMonthTime, "swing")
}

function animateMonthIn() {
    $('.month').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, animateMonthTime, "swing")
}

// book
function animateBookcaseBookOut(object) {
    const imgWidth = $('.book-img').css('width')
    animateMonthOut()
    $('.book-title, .book-author, .book-desc').animate({
        opacity: 0
    }, animateContentTime, "swing")
    $('.book-img').animate({
        right: `-${imgWidth}`
    }, animateImgTime, "swing")
    setTimeout( () => {
        handleBookcaseState(object)
    }, animateOutMax)
}

function animateBookcaseBookIn() {
    const imgWidth = $('.book-img').css('width')
    animateMonthIn()
    $('.book-title, .book-author, .book-desc').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, animateContentTime, "swing")
    $('.book-img').css({
        right: `-${imgWidth}`
    }).animate({
        right: 0
    }, animateImgTime, "swing")
}

// rec
function animateBookcaseRecOut(object) {
    const recFormWidth = $('.rec-form').css('width')
    animateMonthOut()
    $('.rec-title').animate({
        opacity: 0
    }, animateContentTime, "swing")
    $('.rec-form').animate({
        right: `-${recFormWidth}`
    }, animateFormTime, "swing")
    setTimeout( () => {
        handleBookcaseState(object)
    }, animateOutMax)
}

function animateBookcaseRecIn() {
    const recFormWidth = $('.rec-form').css('width')
    animateMonthIn()
    $('.rec-title').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, animateContentTime, "swing")
    $('.rec-form').css({
        right: `-${recFormWidth}`
    }).animate({
        right: 0
    }, animateFormTime, "swing")
}


// ================ SHOW

function showLoader() {
    animateLoader()
    setTimeout( () => {
        $('.loader').animate({
            left: "100%"
        }, 500, "swing")
    }, loaderDuration)
}

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
    }, scrollWatchDelay)
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