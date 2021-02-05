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
const animateImgTime = 700
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

let h2Title = $('<h2>').addClass('month') // append month to bookcase

function generateBookHtml() {
    let imgWrapper = $('<div>').addClass('img-wrapper')
    let divdetailWrapper = $('<div>').addClass('detail-wrapper')
    $('.bookcase').append(divdetailWrapper, imgWrapper) // append book and image wrappers to bookcase
    let pTitle = $('<p>').addClass('book-title')
    let pAuthor = $('<p>').addClass('book-author')
    let pDesc = $('<p>').addClass('book-desc')
    $('.detail-wrapper').append(h2Title, pTitle, pAuthor, pDesc) // append titles, and book details to detail-wrapper
    let imgCover = $('<div>').addClass('book-img')
    // let imgCover = $('<img>').addClass('book-img')
    $('.img-wrapper').append(imgCover) // append book-cover to image wrapper
}

function generateRecHtml() {
    let divRecTextWrapper = $('<div>').addClass('rec-text-wrapper')
    let divRecFormWrapper = $('<div>').addClass('rec-form-wrapper')
    $('.bookcase').append(divRecTextWrapper, divRecFormWrapper) // append rec wrappers to bookcase
    let divRecHeaderWrapper = $('<div>').addClass('rec-header-wrapper')
    $('.rec-text-wrapper').append(h2Title, divRecHeaderWrapper) // append title and header wrapper to text-wrapper
    let pRec1 = $('<p>').addClass('rec-text rec-text-1')
    let pRec2 = $('<p>').addClass('rec-text rec-text-2')
    $('.rec-header-wrapper').append(pRec1, pRec2) // append text to header-wrapper
    let formRec = $('<form>').attr({
        action: `${formEndpoint}`,
        method: 'POST'
    }).addClass('rec-form')
    $('.rec-form-wrapper').append(formRec) // rec title + form append to bookcase
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
        value: "send"
    }).addClass('rec-submit').text('send')
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
    animateMonthOut()
    $('.book-title, .book-author, .book-desc').animate({
        opacity: 0
    }, animateContentTime, "swing")
    $('.book-img').animate({
        left: "140%"
    }, animateImgTime, "swing")
    setTimeout( () => {
        handleBookcaseState(object)
    }, animateOutMax)
}

function animateBookcaseBookIn() { // book in
    animateMonthIn()
    $('.book-title, .book-author, .book-desc').css({
        opacity: 0
    }).animate({
        opacity: 1
    }, animateContentTime, "swing")
    $('.book-img').css({
        left: "140%"
    }).animate({
        left: "50%"
    }, animateImgTime, "swing")
}

function animateBookcaseRecOut(object) { // rec out
    const recFormWidth = $('.rec-form').css('width')
    animateMonthOut()
    $('.rec-text').animate({
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
    $('.rec-text').css({
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
            top: "-100%"
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
    $('.book-img').css({
        'background-image': `url(${object.cover})`,
    })
    // $('.book-img').attr({
    //     src: `${object.cover}`,
    //     alt: `cover artwork for "${object.title}"`
    // })
}

function showRecDetails() {  // rec details
    let recHeader1 = 'Know any good books?'
    let recHeader2 = 'Send me your favourites.'
    $('.rec-text-1').html(recHeader1)
    $('.rec-text-2').html(recHeader2)
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