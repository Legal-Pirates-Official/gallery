const btn = document.querySelectorAll('.sectionbtn');
btn.forEach((b) =>
	b.addEventListener('click', async function check(e) {
		const value = this;
		const mode = value.getAttribute('data-name');
		const fetch1 = await fetch(`/en/valentine/category/${mode}`, {
			method: 'GET',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => (window.location = response.url))
			.catch((error) => console.error(error));
	})
);
const clickme = document.querySelector('.clickme');
if (clickme) {
	clickme.addEventListener('click', async (e) => {
		const currentTemplate = window.location.href.split('/')[6];
		const fetch1 = await fetch(
			`/en/valentine/templatemode/${currentTemplate}`,
			{
				method: 'POST',
				redirect: 'follow',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		const data = await fetch1.json();
		window.location =
			window.location.href.split('.com')[0] + `user/${data[0].name}`;
	});
}
