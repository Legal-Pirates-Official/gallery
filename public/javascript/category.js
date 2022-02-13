const btn = document.querySelectorAll('.sectionbtn');
btn.forEach((b) =>
	b.addEventListener('click', async function check(e) {
		// console.log(e);
		const value = this;
		const mode = value.getAttribute('data-name');
		console.log(mode);
		const fetch1 = await fetch(`/en/valentine/category/${mode}`, {
			method: 'GET',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => (window.location = response.url))
			.catch((error) => console.error(error));
		// console.log(this.getAttribute('data-name'));
	})
);
const clickme = document.querySelector('.clickme');
if (clickme) {
	clickme.addEventListener('click', async (e) => {
		console.log(window.location.href.split('/')[6]);
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
		console.log(data[0].name);
		window.location = `https://momemt2moment.herokuapp.com/user/${data[0].name}`;
	});
}
