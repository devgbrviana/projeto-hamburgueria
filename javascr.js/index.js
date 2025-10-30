document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search");

  input.addEventListener("input", function () {
    const valorBusca = input.value.toLowerCase().trim();

    const produtos = document.querySelectorAll(".product-item");

    produtos.forEach((produto) => {
      const nomeEl = produto.querySelector(".product-name");
      const nome = nomeEl ? nomeEl.textContent.toLowerCase() : "";

      if (valorBusca === "" || nome.includes(valorBusca)) {
        produto.style.display = "block";
      } else {
        produto.style.display = "none";
      }
    });
  });
});