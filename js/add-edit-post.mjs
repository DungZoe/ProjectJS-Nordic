import postApi from "./api/postApi.js";
import AppConstants from './appConstants.js';

const setFormValues = (post) => {
    // Get value of image
    const imageHeroElement = document.querySelector("#postHeroImage");
    if (imageHeroElement) {
        imageHeroElement.style.backgroundImage = `url(${post.imageUrl})`;
    }

    // Get value of title
    const titleInput = document.querySelector("#postTitle");
    if (titleInput) {
        titleInput.value = post.title;
    }

    // Get value of author
    const authorInput = document.querySelector("#postAuthor");
    if (authorInput) {
        authorInput.value = post.author;
    }

    // Get value of description
    const descriptionInput = document.querySelector("#postDescription");
    if (descriptionInput) {
        descriptionInput.value = post.description;
    }
};

const handleChangeImageClick = () => {
    const randomId = 1 + Math.trunc(Math.random() * 1000);

    const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

    const element = document.querySelector('#postHeroImage');
    if (element) {
        element.style.backgroundImage = `url(${imageUrl})`;
        element.addEventListener('error', handleChangeImageClick);
    }
};

const changeBackground = document.querySelector('#postChangeImage');
if (changeBackground) {
    changeBackground.addEventListener('click', handleChangeImageClick);
}

const getImageUrlFromString = (str) => {
    const firstPosition = str.indexOf('"');
    const lastPosition = str.lastIndexOf('"');
    return str.slice(firstPosition + 1, lastPosition);
};

// get formvalue
const getFormValues = () => {
    const formvalues = {};

    const titleElement = document.querySelector('#postTitle');
    if (titleElement) {
        formvalues.title = titleElement.value;
    }

    const authorElement = document.querySelector('#postAuthor');
    if (titleElement) {
        formvalues.author = authorElement.value;
    }

    const discriptionElement = document.querySelector('#postDescription');
    if (titleElement) {
        formvalues.description = discriptionElement.value;
    }

    const postImageElement = document.querySelector('#postHeroImage');
    if (postImageElement) {
        formvalues.imageUrl = getImageUrlFromString(postImageElement.style.backgroundImage);
    }
    return formvalues;
};


// validation input
const validateForm = () => {
    let isValid = true;

    // title is required
    const titleElement = document.querySelector('#postTitle');
    const title = titleElement.value;
    if (!title) {
        titleElement.classList.add('is-invalid');
        isValid = false;
    }

    // author is required
    const authorElement = document.querySelector('#postAuthor');
    const author = authorElement.value;
    if (!author) {
        authorElement.classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
};


// handle formsubmit
const handleFormSubmit = async (postId) => {
    const formValues = getFormValues();

    console.log(formValues);
    const isValid = validateForm(formValues);

    if (!isValid) return;
    try {
        if (postId) {

            const savePostButtonElement = document.querySelector('#savePostButton');
            savePostButtonElement.innerHTML =
                '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Searching the way to your heart...';
            savePostButtonElement.disabled = true;

            formValues.id = postId;
            const updatePost = await postApi.update(formValues);
            alert('Congrats! Your post is saved.')
            window.location = `./post-detail.html?id=${updatePost.id}`;

        } else {

            const savePostButtonElement = document.querySelector('#savePostButton');
            savePostButtonElement.innerHTML =
            '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Searching the way to your heart...';
            savePostButtonElement.disabled = true;

            const addNewPost = await postApi.add(formValues);
            alert('Your post is added. Share it to your friends now.');
            window.location = `./post-detail.html?id=${addNewPost.id}`;
        }
    } catch (error) {
        console.log("Fail in updating data", error);
    }
};


// handle change click image btn function
(async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const isEditMode = !!postId;

    if (isEditMode) {
        const post = await postApi.get(postId);
        // console.log(post);

        setFormValues(post);

        const goToDetailPageLink = document.querySelector('#goToDetailPageLink');
        goToDetailPageLink.href = `./post-detail.html?id=${post.id}`;
        goToDetailPageLink.innerHTML = '<i class="fas fa-eye mr-1"></i> View post detail';

    } else {
        handleChangeImageClick();
    }

    // add event submit
    const formElement = document.querySelector('#postForm');
    if (formElement) {
        formElement.addEventListener('submit', (e) => {
            handleFormSubmit(postId);
            e.preventDefault();
        });
    }

    // event click change bg image
    const imageElement = document.querySelector('#postHeroImage');
    if (imageElement) {
        imageElement.onerror = handleChangeImageClick;
    }

})();