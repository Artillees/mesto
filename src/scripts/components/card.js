const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content
    .querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { currentUserId, onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();

  const cardImage =
    cardElement.querySelector(".card__image");

  const cardTitle =
    cardElement.querySelector(".card__title");

  const likeButton =
    cardElement.querySelector(".card__like-button");

  const likeCount =
    cardElement.querySelector(".card__like-count");

  const deleteButton =
    cardElement.querySelector(
      ".card__control-button_type_delete"
    );

  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardTitle.textContent = data.name;

  likeCount.textContent = data.likes.length;

  const isLiked = data.likes.some(
    (user) => user._id === currentUserId
  );

  likeButton.classList.toggle(
    "card__like-button_is-active",
    isLiked
  );

  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(
        data._id,
        cardElement,
        deleteButton
      );
    });
  }

  likeButton.addEventListener("click", () => {
    onLikeIcon(
      data,
      likeButton,
      likeCount
    );
  });

  cardImage.addEventListener("click", () => {
    onPreviewPicture({
      name: data.name,
      link: data.link,
    });
  });

  return cardElement;
};
