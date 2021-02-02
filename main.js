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
    $('.bookcase').append(h2Title) // append month to bookcase
}

function generateBookHtml() {
    generateBookcaseTitle()
    let pTitle = $('<p>').addClass('book-title')
    let pAuthor = $('<p>').addClass('book-author')
    let imgCover = $('<img>').addClass('book-img')
    let pDesc = $('<p>').addClass('book-desc')
    $('.bookcase').append(pTitle, pAuthor, imgCover, pDesc) // append book details to bookcase
}

function generateRecHtml() {
    generateBookcaseTitle()
    let pRec = $('<p>').addClass('rec-title')
    let formRec = $('<form>').attr({
        action: `${formEndpoint}`,
        method: 'POST'
    }).addClass('rec-form')
    $('.bookcase').append(pRec, formRec) // rec title + form append to bookcase
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
    $('.rec-form').append(inputTitle, inputAuthor, buttonSub) // form items append to rec-form
}


// ================ ANIMATE

function animateLoader() { // loader
    $('.loader-title').animate({
        opacity: 1
    }, loaderFadeInTime, "swing")
}

function animateMonthOut() { // month out
    $('.month').animate({
        opacity: 0
    }, animateMonthTime, "swing")
}

function animateMonthIn() { // month in
    $('.month').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, animateMonthTime, "swing")
}

function animateBookcaseBookOut(object) { // book out
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

function animateBookcaseBookIn() { // book in
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

function animateBookcaseRecOut(object) { // rec out
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

function animateBookcaseRecIn() { // rec in
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

function showLoader() { // loader
    animateLoader()
    setTimeout( () => {
        $('.loader').animate({
            left: "100%"
        }, 500, "swing")
    }, loaderDuration)
}

function showMonth(object) {  // month
    $('.month').text(object.month)
}

function showBookDetails(object) {  // book details
    $('.book-title').html(object.title)
    $('.book-author').html(object.author)
    $('.book-desc').html(object.desc)
}

function showBookImage(object) { // book image
    $('.book-img').attr({
        src: `${object.cover}`,
        alt: `cover artwork for "${object.title}"`
    })
}

function showRecDetails() {  // rec details
    let formHeader = 'know any good books?'
    $('.rec-title').html(formHeader)
}


// ================ HANDLE

function handleBookcaseState(object) {
    $('.bookcase').html('') // reset html
    if (object.book) { // if book is found i.e. 'true'
        generateBookHtml()
        showMonth(object)
        showBookDetails(object)
        showBookImage(object)
        animateBookcaseBookIn()
    } else { // if not
        generateRecHtml()
        showMonth(object)
        showRecDetails()
        animateBookcaseRecIn()
    }
}

function handleScrollDown() {
    if (currentIndex === 11) { // if index is at the end
        return
    } else { // prep next object and animate out
        let currentObject = library[currentIndex]
        currentIndex++
        let nextObject = library[currentIndex] 
        if (currentObject.book) { // if current object is book transition book out
            animateBookcaseBookOut(nextObject)
        } else { // if current object is rec transition rec out
            animateBookcaseRecOut(nextObject)
        }
    }
}

function handleScrollUp() {
    if (currentIndex === 0) { // if index is at the start
        return
    } else { // prep prev object and animate out
        let currentObject = library[currentIndex]
        currentIndex--
        let prevObject = library[currentIndex] 
        if (currentObject.book) { // if current object is book transition book out
            animateBookcaseBookOut(prevObject)
        } else { // if current object is rec transition rec out
            animateBookcaseRecOut(prevObject)
        }
    }
}


// ================ WATCH

function watchDesktopScroll() {
    // mouse
    $(scrollTarget).on('wheel', (e) => {
        const scrollY = e.originalEvent.deltaY
        $(scrollTarget).off('wheel') // pause watch
        if (scrollY > 0) { // execute on scroll DOWN
            handleScrollDown()
        } else if (scrollY < 0) { // execute on scroll UP
            handleScrollUp()
        }
        setTimeout( () => { // restart watch
            watchDesktopScroll()
        }, scrollWatchDelay)
    })
    // key
    $(window).on('keydown', (e) => {
        const keyCode = e.originalEvent.keyCode
        $(window).off('keydown') // pause watch
        if (keyCode === 40) { // execute on arrow DOWN
            handleScrollDown()
        } else if (keyCode === 38) { // execute on arrow UP
            handleScrollUp()
        }
        setTimeout( () => { // restart watch
            watchDesktopScroll()
        }, scrollWatchDelay)
    })
}

function watchMobileScroll() { // initialize hammer plug-in
    mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL })
    mc.on('swipeup', () => {
        handleScrollDown() // execute on swipe UP
    })
    mc.on('swipedown', () => {
        handleScrollUp() // execute on swipe DOWN
    })
}

function watchScroll() {
    watchMobileScroll() // touch
    watchDesktopScroll() // wheel / keycode
}


// ================ ON LOAD
$(handleBookcaseState(currentBookObject)) // initialize bookcase
$(showLoader) // initialize loader
$(watchScroll) // initialize scroll behavior