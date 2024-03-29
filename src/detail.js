import { moviePage, loadGenre } from "./fetch.js";

const id = new URL(location.href).searchParams.get("id");

console.log(id);

async function load() {
  await loadGenre();
  loadReview();
  return moviePage(id);
}

load();

const form = document.getElementById("detailCommentReviewWrap");
const userId = document.getElementById("detailReviewUserId");
const userPwd = document.getElementById("detailReviewUserPwd");
const userStar = document.getElementById("detailReviewStar");
const userText = document.getElementById("detailReviewContent");

function sendReview(e) {
  e.preventDefault();
  // 리뷰키 유무 확인
  let ReviewList = {};
  if (window.localStorage.getItem(id) !== null) {
    ReviewList = JSON.parse(window.localStorage.getItem(id));
  }
  let userKey = crypto.randomUUID();
  if (!ReviewList.hasOwnProperty(userKey)) {
    ReviewList[userKey] = {};
  }
  ReviewList[userKey] = userReviewInfo();
  // 사용자 리뷰 내용 저장
  window.localStorage.setItem(id, JSON.stringify(ReviewList));
  alert("리뷰가 작성되었습니다.");
  form.reset();
  loadReview();
}
form.addEventListener("submit", sendReview);

function userReviewInfo() {
  return {
    userName: userId.value,
    pwd: userPwd.value,
    content: userText.value,
    star: userStar.value
  };
}

function loadReview() {
  const guestReview = document.getElementById("movieReview");
  guestReview.innerHTML = "";
  userText.focus();

  const ReviewList = JSON.parse(window.localStorage.getItem(id)) || {};
  Object.entries(ReviewList).forEach(([reviewId, review]) => {
    const entryHtml = `
    <li id=${reviewId}>
      <div class="detail_comment_list">
        <div class="detail_comment_list_user">
          <div class="detail_comment_list_user_id" id="userId">${review.userName}</div>
          <div class="detail_comment_list_user_text" id="userInputComment">${review.content}</div>
        </div>
        <div class ="starAndBtn">
          <div class="detail_comment_list_user_star" id="userInputStar">${review.star}</div>
          <button id="deleteReview" >삭제</button>
        </div>
      </div>
    </li>`;
    guestReview.insertAdjacentHTML("beforeend", entryHtml);
  });
  document.querySelectorAll("#deleteReview").forEach((button) => button.addEventListener("click", deleteReview));
}

function deleteReview() {
  let reviewId = this.closest("li").id;
  let ReviewList = JSON.parse(window.localStorage.getItem(id));

  if (prompt("비밀번호를 입력해주세요") === ReviewList[reviewId].pwd) {
    delete ReviewList[reviewId];
    window.localStorage.setItem(id, JSON.stringify(ReviewList));
    alert("삭제되었습니다.");
  } else {
    alert("비밀번호가 올바르지 않습니다.");
  }

  loadReview();

  if (Object.keys(ReviewList).length === 0) {
    window.localStorage.removeItem(id);
  }
}
