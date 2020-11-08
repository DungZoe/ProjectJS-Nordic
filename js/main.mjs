import postApi from "./api/postApi.js";
import AppConstants from './appConstants.js';
import utils from "./utils.js";

const renderpostList = (postList) => {
    const ulElement = document.querySelector("#postsList");

    postList.forEach((post) => {

        // Get template
        const templateElement = document.querySelector("#postItemTemplate");
        if (!templateElement) return;

        // Clone li
        const liElementFromTemplate = templateElement.content.querySelector("li");
        const newLiElement = liElementFromTemplate.cloneNode(true);
        // console.log(newLiElement);

        // ----- Fill data ----- 
        // set title
        const titleElement = newLiElement.querySelector("#postItemTitle");
        if (titleElement) {
            titleElement.textContent = post.title;
        }

        // set name of author
        const authorElement = newLiElement.querySelector("#postItemAuthor");
        if (authorElement) {
            authorElement.textContent = post.author;
        }

        // set description
        const descripElement = newLiElement.querySelector("#postItemDescription");
        if (descripElement) {
            descripElement.textContent = post.description;
        }

        // set img
        const imgElement = newLiElement.querySelector("#postItemImage");
        if (imgElement) {
            imgElement.src = post.imageUrl;
        }

        //set date
        const date = newLiElement.querySelector("#postItemTimeSpan");
        if (date) {
            date.textContent = `${utils.formatDate(post.createdAt)}`
        }

        // Add click event for the post div
        const divElement = newLiElement.querySelector("#postItem");
        if (divElement) {
            divElement.addEventListener("click", () => {
                window.location = `/post-detail.html?id=${post.id}`;
            });
        }

        // Add click event for edit button
        const editElement = newLiElement.querySelector("#postItemEdit");
        if (editElement) {
            editElement.addEventListener("click", (e) => {
                // Stop bubbling
                e.stopPropagation();

                window.location = `/add-edit-post.html?id=${post.id}`;
            });
        }

        // Add click event for remove button
        const removeElement = newLiElement.querySelector("#postItemRemove");
        if (removeElement) {
            removeElement.addEventListener("click", async (e) => {
                // Stop bubbling
                e.stopPropagation();

                // Ask user whether they want to delete
                const message = `Are you sure to permanent delete post ${post.title} written by ${post.author}?`;
                if (window.confirm(message)) {
                    try {
                        await postApi.remove(post.id);

                        // remove li element
                        newLiElement.remove();
                    } catch (error) {
                        console.log("Failed to remove post:", error);
                    }
                }
            });
        }


        // Append li to ul
        ulElement.appendChild(newLiElement);
    })
};


(async function () {
    try {

        const params = { _page: 1, _limit: 6 };

        const response = await postApi.getAll(params);
        const postList = response.data;

        console.log(postList);

        // hide loading
        const spinnerElement = document.querySelector("#spinner");
        if (spinnerElement) {
            spinnerElement.classList.add("d-none");
        }


        renderpostList(postList);
    } catch (error) {
        console.log("Failed to fetch post list", error);
    }
})();