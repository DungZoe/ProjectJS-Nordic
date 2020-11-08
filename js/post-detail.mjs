import postApi from "./api/postApi.js";
import AppConstants from './appConstants.js';
import utils from "./utils.js";

const renderpost = (post) => {
    const postElement = document.querySelector(".post-detail");

    // set title
    const titleElement = postElement.querySelector("#postDetailTitle");
    if (titleElement) {
        titleElement.textContent = post.title;
    }

    // set name of author
    const authorElement = postElement.querySelector("#postDetailAuthor");
    if (authorElement) {
        authorElement.textContent = post.author;
    }

    // set description
    const descripElement = postElement.querySelector("#postDetailDescription");
    if (descripElement) {
        descripElement.textContent = post.description;
    }

    // set background
    const bgElement = document.querySelector("#postHeroImage");
    if (bgElement) {
        bgElement.style.backgroundImage = `url(${post.imageUrl || AppConstants.DEFAULT_HERO_IMAGE_URL
            })`;
    }

    //set date
    const date = document.querySelector("#postDetailTimeSpan");
    if (date) {
        date.textContent = `${utils.formatDate(post.createdAt)}`
    }
};

// const changeBackground = document.querySelector('#postChangeImage');
// if (changeBackground) {
//     changeBackground.addEventListener('click', handleChangeImageClick);
// }

// const getImageUrlFromString = (str) => {
//     const firstPosition = str.indexOf('"');
//     const lastPosition = str.lastIndexOf('"');
//     return str.slice(firstPosition + 1, lastPosition);
// };

// const heroImg = () => {
//     const formvalues = {};

//     const postImageElement = document.querySelector('#postHeroImage');
//     if (postImageElement) {
//         formvalues.imageUrl = getImageUrlFromString(postImageElement.style.backgroundImage);
//     }
//     return formvalues;
// };

const main = async () => {
    // 1. Get id from url params
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    // 2. Find post based on id
    const post = await postApi.get(postId);

    // 3. Render
    renderpost(post);

    // 4. Bind edit link
    const editLinkElement = document.querySelector("#editLink");
    if (editLinkElement) {
        editLinkElement.href = `/add-edit-post.html?id=${postId}`;
        editLink.innerHTML = '<i class="fas fa-edit"></i> Edit your post';
    }
};

main();