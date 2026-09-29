import {
  addCard,
  changeLikeCardStatus,
  deleteCardFromServer,
  getCardList,
  getUserInfo,
  setUserAvatar,
  setUserInfo,
} from "./components/api.js";

import { createCardElement } from "./components/card.js";

import {
  closeModalWindow,
  openModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";

import {
  clearValidation,
  enableValidation,
} from "./components/validation.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const placesWrap = document.querySelector(".places__list");

const profileFormModalWindow =
  document.querySelector(".popup_type_edit");

const profileForm =
  profileFormModalWindow.querySelector(".popup__form");

const profileTitleInput =
  profileForm.querySelector(".popup__input_type_name");

const profileDescriptionInput =
  profileForm.querySelector(
    ".popup__input_type_description"
  );

const profileFormSubmitButton =
  profileForm.querySelector(".popup__button");

const cardFormModalWindow =
  document.querySelector(".popup_type_new-card");

const cardForm =
  cardFormModalWindow.querySelector(".popup__form");

const cardNameInput =
  cardForm.querySelector(".popup__input_type_card-name");

const cardLinkInput =
  cardForm.querySelector(".popup__input_type_url");

const cardFormSubmitButton =
  cardForm.querySelector(".popup__button");

const imageModalWindow =
  document.querySelector(".popup_type_image");

const imageElement =
  imageModalWindow.querySelector(".popup__image");

const imageCaption =
  imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton =
  document.querySelector(".profile__edit-button");

const openCardFormButton =
  document.querySelector(".profile__add-button");

const profileTitle =
  document.querySelector(".profile__title");

const profileDescription =
  document.querySelector(".profile__description");

const profileAvatar =
  document.querySelector(".profile__image");

const avatarFormModalWindow =
  document.querySelector(".popup_type_edit-avatar");

const avatarForm =
  avatarFormModalWindow.querySelector(".popup__form");

const avatarInput =
  avatarForm.querySelector(".popup__input_type_avatar");

const avatarFormSubmitButton =
  avatarForm.querySelector(".popup__button");

let currentUserId = null;

const setLoadingState = (
  buttonElement,
  isLoading,
  loadingText
) => {
  if (isLoading) {
    buttonElement.dataset.defaultText =
      buttonElement.textContent;

    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent =
      buttonElement.dataset.defaultText;

    delete buttonElement.dataset.defaultText;

    buttonElement.disabled = false;
  }
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;

  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  setLoadingState(
    profileFormSubmitButton,
    true,
    "Сохранение..."
  );

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoadingState(
        profileFormSubmitButton,
        false
      );
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();

  setLoadingState(
    avatarFormSubmitButton,
    true,
    "Сохранение..."
  );

  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage =
        `url(${userData.avatar})`;

      avatarForm.reset();

      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoadingState(
        avatarFormSubmitButton,
        false
      );
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  setLoadingState(
    cardFormSubmitButton,
    true,
    "Создание..."
  );

  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, {
          currentUserId,
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeIcon,
          onDeleteCard: handleDeleteCard,
        })
      );

      cardForm.reset();

      closeModalWindow(cardFormModalWindow);

      clearValidation(
        cardForm,
        validationConfig
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoadingState(
        cardFormSubmitButton,
        false
      );
    });
};

const handleLikeIcon = (
  cardData,
  likeButton,
  likeCount
) => {
  const isLiked =
    likeButton.classList.contains(
      "card__like-button_is-active"
    );

  likeButton.disabled = true;

  changeLikeCardStatus(
    cardData._id,
    isLiked
  )
    .then((updatedCard) => {
      likeButton.classList.toggle(
        "card__like-button_is-active",
        updatedCard.likes.some(
          (user) =>
            user._id === currentUserId
        )
      );

      likeCount.textContent =
        updatedCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      likeButton.disabled = false;
    });
};

const handleDeleteCard = (
  cardId,
  cardElement,
  deleteButton
) => {
  deleteButton.disabled = true;

  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
      deleteButton.disabled = false;
    });
};

profileForm.addEventListener(
  "submit",
  handleProfileFormSubmit
);

cardForm.addEventListener(
  "submit",
  handleCardFormSubmit
);

avatarForm.addEventListener(
  "submit",
  handleAvatarFormSubmit
);

openProfileFormButton.addEventListener(
  "click",
  () => {
    profileTitleInput.value =
      profileTitle.textContent;

    profileDescriptionInput.value =
      profileDescription.textContent;

    clearValidation(
      profileForm,
      validationConfig
    );

    openModalWindow(
      profileFormModalWindow
    );
  }
);

profileAvatar.addEventListener(
  "click",
  () => {
    avatarForm.reset();

    clearValidation(
      avatarForm,
      validationConfig
    );

    openModalWindow(
      avatarFormModalWindow
    );
  }
);

openCardFormButton.addEventListener(
  "click",
  () => {
    cardForm.reset();

    clearValidation(
      cardForm,
      validationConfig
    );

    openModalWindow(
      cardFormModalWindow
    );
  }
);

const allPopups =
  document.querySelectorAll(".popup");

allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationConfig);

Promise.all([
  getCardList(),
  getUserInfo(),
])
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    profileTitle.textContent =
      userData.name;

    profileDescription.textContent =
      userData.about;

    profileAvatar.style.backgroundImage =
      `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      placesWrap.append(
        createCardElement(cardData, {
          currentUserId,
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeIcon,
          onDeleteCard: handleDeleteCard,
        })
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });