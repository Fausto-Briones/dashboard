# dashboard

let buttonListener = async (event) => {
  let text = document.getElementById("newsletter1").value
  arregloLibros.forEach(book=>{
    let title = book.querySelector("Book-Title").textContent;
    let author = book.querySelector("Book-Author").textContent;
    let editorial = book.querySelector("Publisher").textContent;
    let libreriaElement = document.querySelector("#libreria");
    libreriaElement.innerHTML = ''
    if(text==author || text==title || text==editorial){

    }
  
  })
}

let searchEventListener = () => {
  let selectElement = document.querySelector(".btn")
  selectElement.addEventListener("click", buttonListener)
}

searchEventListener();
