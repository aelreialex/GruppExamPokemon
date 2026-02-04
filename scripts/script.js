const log = (msg) => console.log(msg);

window.addEventListener("load", () => {
	prepGame();
});

function prepGame() {
	document.querySelector("#gameField").classList.add("d-none");
	document.querySelector("#submitBtn").addEventListener("click", (event) => {
		event.preventDefault();
		if (validateForm()) {
			startGame();
			startMusic();
		}
	});
}

function validateForm() {
	const nameRef = document.querySelector("#nick");
	const ageRef = document.querySelector("#age");
	const boyRef = document.querySelector("#boy");
	const girlRef = document.querySelector("#girl");
	const genderRef = document.querySelector("#formGenderWrapper");
	const errorRef = document.querySelector("#formErrorMsg");

	oGameData.trainerName = nameRef.value;
	oGameData.trainerAge = ageRef.value;
	if (boyRef.checked) {
		oGameData.trainerGender = "boy";
	} else if (girlRef.checked) {
		oGameData.trainerGender = "girl";
	} else {
		oGameData.trainerGender = null;
	}

	log(oGameData.trainerName);

	try {
		clearError(nameRef, ageRef, genderRef, errorRef);

		if (
			oGameData.trainerName.length < 5 ||
			oGameData.trainerName.length > 10
		) {
			nameRef.classList.add("form__input--error");
			throw {
				msg: "Ditt användarnamn måste vara lika med eller mellan 5-10 bokstäver",
			};
		} else if (oGameData.trainerAge < 10 || oGameData.trainerAge > 15) {
			ageRef.classList.add("form__input--error");
			throw { msg: "Du måste vara mellan 10 och 15 år gammal!" };
		} else if (oGameData.trainerGender === null) {
			genderRef.classList.add("form__gender-wrapper--error");
			throw { msg: "Du måste välja ett kön!" };
		}
		return true;
	} catch (error) {
		log(error.msg);
		errorRef.textContent = error.msg;
		return false;
	}
}

function clearError(nameRef, ageRef, genderRef, errorRef) {
	ageRef.classList.remove("form__input--error");
	nameRef.classList.remove("form__input--error");
	genderRef.classList.remove("form__gender-wrapper--error");
	errorRef.textContent = "";
}

function startGame() {
	document.querySelector("audio").load();
	startMusic();
	document.querySelector("body").style.backgroundImage =
		`url(./assets/arena-background.png)`;
	document.querySelector("#formWrapper").classList.add("d-none");
	document.querySelector("#gameField").classList.remove("d-none");
	document.querySelector("#audio").addEventListener("click", toggleMusic);
	randomizePokemon();
	drawPokemons();
	oGameData.startTimeInMilliseconds();
	setTimeout(myInterval, 50);
	timer();
}

function startMusic() {
	document.querySelector("audio").play();
	document.querySelector("audio").volume = 0.3;
}

function toggleMusic() {
	if (!document.querySelector("audio").paused) {
		document.querySelector("audio").pause();
	} else {
		document.querySelector("audio").play();
	}
}

function randomizePokemon() {
	log("randomizePokemon()");
	let isDone = false;
	let cycleCounter = 0;

	while (!isDone) {
		const randomNum = Math.floor(Math.random() * 151 + 1);

		if (oGameData.pokemonNumbers.includes(randomNum)) {
		} else {
			oGameData.pokemonNumbers[cycleCounter] = randomNum;
			cycleCounter++;
		}

		if (cycleCounter === 10) {
			isDone = true;
		}
	}
}

function drawPokemons() {
	log("drawPokemons()");
	const gameFieldRef = document.querySelector("#gameField");

	for (let pokemon of oGameData.pokemonNumbers) {
		const imgRef = document.createElement("img");

		if (pokemon < 10) {
			imgRef.src = `./assets/pokemons/00${pokemon}.png`;
		} else if (pokemon < 100) {
			imgRef.src = `./assets/pokemons/0${pokemon}.png`;
		} else {
			imgRef.src = `./assets/pokemons/${pokemon}.png`;
		}
		const originalImg = imgRef.src;
		imgRef.style.left = `${oGameData.getLeftPosition()}px`;
		imgRef.style.top = `${oGameData.getTopPosition()}px`;
		imgRef.classList.add("game-field__img");
		gameFieldRef.appendChild(imgRef);

		imgRef.addEventListener("mouseover", () => {
			if (imgRef.src === originalImg) {
				imgRef.src = "./assets/ball.webp";
				oGameData.nmbrOfCaughtPokemons++;
				log(oGameData.nmbrOfCaughtPokemons);
				checkWin();
			} else {
				imgRef.src = originalImg;
				oGameData.nmbrOfCaughtPokemons--;
				log(oGameData.nmbrOfCaughtPokemons);
			}
		});
	}
}

function checkWin() {
	log("checkWin()");
	if (oGameData.nmbrOfCaughtPokemons === 10) {
		gameOver();
	}
}

function gameOver() {
	clearInterval(oGameData.timerId);
	oGameData.endTimeInMilliseconds();
	log(oGameData.nmbrOfMilliseconds());

	let imgRef = document.querySelectorAll("#gameField > img");
	for (let img of imgRef) {
		img.remove();
	}
	displayHighscores(saveHighscore());
}

function timer() {
	oGameData.timerId = setInterval(myInterval, 3000);
}

function myInterval() {
	for (let i = 1; i <= 10; i++) {
		document.querySelector(
			`#gameField > img:nth-of-type(${i})`,
		).style.left = `${oGameData.getLeftPosition()}px`;
		document.querySelector(`#gameField > img:nth-of-type(${i})`).style.top =
			`${oGameData.getTopPosition()}px`;
	}
}

// I denna fil skriver ni all er kod
log(new Date());

function loadHighscore() {
	const scores = localStorage.getItem("pokemonHighscores");
return JSON.parse(scores) || [];
}

function saveHighscore() {
	const scores = loadHighscore();
	const name = oGameData.trainerName;
	const age = oGameData.trainerAge;
	const gender = oGameData.trainerGender;
	const time = oGameData.nmbrOfMilliseconds();
	scores.push({name, age, gender, time});
	scores.sort((a, b) => a.time - b.time);
	if (scores.length > 10) scores.splice(10);
	localStorage.setItem('pokemonHighscores', JSON.stringify(scores));
	console.log(scores);
	return scores;
}

function displayHighscores(scores) {
	document.querySelector('#highScore').classList.remove("d-none");
	document.querySelector('#winMsg').textContent = `Bra jobbat ${oGameData.trainerName}! Du fångade alla pokemons på ${oGameData.nmbrOfMilliseconds()}millisekunder!`;
	const list = document.querySelector("#highscoreList");
	list.innerHTML = "";
	scores.forEach((score, index) => {
		const li = document.createElement("li");
		li.textContent = `${score.name}, ${score.age} år,  ${score.gender} - ${score.time}ms`;
		list.classList.add('highscore-list__list-item');
		list.appendChild(li);
	});
	document.querySelector('#playAgainBtn').addEventListener('click', () => {
		resetGame();
	})
}

function resetGame() {
	oGameData.init();
	document.querySelector('#highScore').classList.add('d-none');
	document.querySelector("#gameField").classList.add("d-none");
	document.querySelector("#formWrapper").classList.remove("d-none");
	document.querySelector("audio").pause();

}

