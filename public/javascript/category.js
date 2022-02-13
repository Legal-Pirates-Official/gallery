const btn = document.querySelectorAll('.sectionbtn');
btn.forEach((b) =>
	b.addEventListener('click', async function check(e) {
<<<<<<< HEAD
		const value = this;
		const mode = value.getAttribute('data-name');
=======
		// console.log(e);
		const value = this;
		const mode = value.getAttribute('data-name');
		console.log(mode);
>>>>>>> c7bc265a54a4d6beae9019b181b0732426dcd7cf
		const fetch1 = await fetch(`/en/valentine/category/${mode}`, {
			method: 'GET',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => (window.location = response.url))
			.catch((error) => console.error(error));
<<<<<<< HEAD
=======
		// console.log(this.getAttribute('data-name'));
>>>>>>> c7bc265a54a4d6beae9019b181b0732426dcd7cf
	})
);
const clickme = document.querySelector('.clickme');
if (clickme) {
	clickme.addEventListener('click', async (e) => {
<<<<<<< HEAD
=======
		console.log(window.location.href.split('/')[6]);
>>>>>>> c7bc265a54a4d6beae9019b181b0732426dcd7cf
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
<<<<<<< HEAD
		// const data = await fetch1.json();
		// window.location =
		// 	window.location.href.split('.com')[0] + `user/${data[0].name}`;
=======
		const data = await fetch1.json();
		console.log(data[0].name);
		window.location = `https://momemt2moment.herokuapp.com/user/${data[0].name}`;
>>>>>>> c7bc265a54a4d6beae9019b181b0732426dcd7cf
	});
}
