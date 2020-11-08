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
            titleElement.addEventListener('click', () => {
                window.location = `./post-detail.html?id=${post.id}`;
            });
            titleElement.textContent = `${post.title}`;
        }

        // set name of author
        const authorElement = newLiElement.querySelector("#postItemAuthor");
        if (authorElement) {
            authorElement.textContent = `${post.author}`;
        }

        // set description
        const descripElement = newLiElement.querySelector("#postItemDescription");
        if (descripElement) {
            descripElement.textContent = `${post.description.slice(0, 100)}...`;
        }

        // set img
        const imgElement = newLiElement.querySelector("#postItemImage");
        if (imgElement) {
            imgElement.src = post.imageUrl;
            imgElement.addEventListener('click', () => {
                window.location = `./post-detail.html?id=${post.id}`;
            });
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
                        console.log('Failed to remove post:', error);
                    }
                }
            });
        }

        // Append li to ul
        ulElement.appendChild(newLiElement);
    })
};

//pagination
const getPageList = (pagination) => {
    const { _limit, _totalRows, _page } = pagination;
    const totalPages = Math.ceil(_totalRows / _limit);
    let prevPage = -1;

    //invalid page detected
    if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];

    if (_page === 1) prevPage = 1;
    else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
    else prevPage = _page - 1;

    const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
    const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

    return [
        _page === 1 || _page === 1 ? 0 : _page - 1,
        prevPage,
        currPage,
        nextPage,
        _page === totalPages || totalPages === _page ? 0 : _page + 1,
    ];
};

const renderPostsPagination = (pagination) => {
    const postPagination = document.querySelector('#postsPagination');
    if (postPagination) {
        const pageList = getPageList(pagination);
        const { _page, _limit } = pagination;
        const pageItems = postPagination.querySelectorAll('.page-item');
        if (pageItems.length === 5) {
            pageItems.forEach((item, idx) => {
                if (pageList[idx] === -1) {
                    item.setAttribute('hidden', '');
                    return;
                }

                if (pageList[idx] === 0) {
                    item.classList.add('disabled');
                    return;
                }

                const pageLink = item.querySelector('.page-link');
                if (pageLink) {
                    pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

                    if (idx > 0 && idx < 4) {
                        pageLink.textContent = pageList[idx];
                    }
                }

                if (idx > 0 && idx < 4 && pageList[idx] === _page) {
                    item.classList.add('active');
                }
            });

            postPagination.removeAttribute('hidden');
        }
    }
};


// ====== MAIN ======
(async function () {
    try {

        const params = { _page: 1, _limit: 6 };

        //Page button
        const response = await postApi.getAll(params);
        const postList = response.data;

        renderpostList(postList);

        // hide loading
        const spinnerElement = document.querySelector("#spinner");
        spinnerElement.style.display = 'none';
        // render
      } catch (error) {
        console.log('Failed to fetch post list', error);
    }
})();