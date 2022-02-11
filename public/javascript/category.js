//
const btn = document.querySelectorAll(".sectionbtn");
btn.forEach((b) =>
  b.addEventListener("click", async function  check(e)  {
    // console.log(e);
    const value = this;
    const mode = value.getAttribute("data-name");
    console.log(mode);
    const fetch1 = await fetch(`http://localhost:8080/en/valentine/category/${mode}`,{

        method: "GET",
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
          }

    })
      .then((response) => window.location = response.url)
      .catch((error) => console.error(error));
    // console.log(this.getAttribute('data-name'));
  })
);
