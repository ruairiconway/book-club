'use strict'

// Library object array linked from library.js
// i.e. 
// library = [
//     {
//         month: "jan",
//         bookTitle: "humankind: a hopeful history",
//         bookAuthor: "Rutger Bregman",
//         bookDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mattis auctor nibh eget rutrum. Fusce ut dui ultrices, lacinia dolor congue, scelerisque vivamus.",
//         cover: ""
//     }
// ]

// ============ VARIABLES

const emptyTitle = "tbd"
const month = library[0].month


// ============ GENERATE

function generateBookcaseDisplayHtml() {
    return `
    <div class="bookcase-display">
        <p class="book-title"></p>
        <p class="book-author"></p>
        <img class="book-img">
        <p class="book-desc"></p>
    </div>`
}

function generateBookcaseRecHtml() {
    return `
    <div class="bookcase-rec">
        <p>what should I read next?</p>
        <form>
            <input type="text" name="rec-form-title" id="rec-form-title" placeholder="title.." aria-label="book title">
            <input type="text" name="rec-form-author" id="rec-form-author" placeholder="author.." aria-label="book author">
            <input type="text" name="rec-form-desc" id="rec-form-desc" placeholder="why.." aria-label="book description">
            <button type="submit" value="share">share</button>
        </form>
    </div>`
}


// ============ SHOW

function showBookcaseDisplay(bookObject) {
    let bookcaseDisplayHtml = generateBookcaseDisplayHtml()
    $('.bookcase').html(`${bookcaseDisplayHtml}`)
    $('.book-title').html(`${bookObject.bookTitle}`)
    $('.book-author').html(`${bookObject.bookAuthor}`)
    $('.book-desc').html(`${bookObject.bookDesc}`)
}

function showBookcaseRec() {
    let bookcaseRecHtml = generateBookcaseRecHtml()
    $('.bookcase').html(`${bookcaseRecHtml}`)
}


// ============ HANDLE

function handleBookcase() {
    $('.month').html(`${month}`)
    // based on month, show display page or show rec page
    for (let i = 0; i < library.length; i++) {
        if (month === library[i].month) {
            let bookObject = library[i]
            if (bookObject.bookTitle === emptyTitle) {
                showBookcaseRec()
            } else {
                showBookcaseDisplay(bookObject)
            }
        }
    }
}


// ============ ON LOAD

$(handleBookcase)