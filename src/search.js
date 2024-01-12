// 검색 페이지 파일
import { searchPage, loadGenre } from "./fetch.js";
import { handleClickCard } from "./movie.js";

let currentPage = 1;

async function load() {
  const keyword = new URL(location.href).searchParams.get("query");
  await loadGenre();
  searchPage(currentPage, keyword);
}

function morePage() {
  currentPage++;
  searchPage(currentPage, keyword);
}

load();
document.getElementById("searchInput").focus();
document.getElementById("morePage").addEventListener("click", morePage);
document.getElementById("movies").addEventListener("click", handleClickCard);
