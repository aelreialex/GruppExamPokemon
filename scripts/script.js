const log = (msg) => console.log(msg);

window.addEventListener('load', () => {
    prepGame();
})

function prepGame() {
    document.querySelector('#gameField').classList.add('d-none');
    document.querySelector('#submitBtn').addEventListener('click', (event) => {
        event.preventDefault();
        if (validateForm()) {
            startGame();
            startMusic();
        }
    })
}

function validateForm(){
    const nameRef = document.querySelector('#nick');
    const ageRef = document.querySelector('#age');
    const boyRef = document.querySelector('#boy');
    const girlRef = document.querySelector('#girl');
    const genderRef = document.querySelector('#formGenderWrapper');
    const errorRef = document.querySelector('#formErrorMsg');
    
    oGameData.trainerName = nameRef.value;
    oGameData.trainerAge = ageRef.value;
    if(boyRef.checked) {
        oGameData.trainerGender = 'boy';
    } else if (girlRef.checked)  {
        oGameData.trainerGender = "girl";
    } else {
        oGameData.trainerGender = null;
    }

    console.log(oGameData.trainerName);

    try{
        clearError(nameRef, ageRef, genderRef, errorRef);

        if (oGameData.trainerName.length < 5 || oGameData.trainerName.length > 10){
            nameRef.classList.add('form__input--error');
            throw ({msg : "Ditt användarnamn måste vara lika med eller mellan 5-10 bokstäver"})
        } else if (oGameData.trainerAge < 10 || oGameData.trainerAge > 15){
            ageRef.classList.add('form__input--error');
            throw ({msg : "Du måste vara mellan 10 och 15 år gammal!"})
        } else if (oGameData.trainerGender === null){
            genderRef.classList.add('form__gender-wrapper--error');
            throw ({msg : "Du måste välja ett kön!"});
        }
        
        return true;
    }

    catch (error){
        console.log(error.msg);
        errorRef.textContent = error.msg;
        return false;
    }
}

function clearError(nameRef, ageRef, genderRef, errorRef) {
            ageRef.classList.remove('form__input--error');
            nameRef.classList.remove('form__input--error');
            genderRef.classList.remove('form__gender-wrapper--error'); 
            errorRef.textContent = "";
}

function startGame() {
    document.querySelector('#formWrapper').classList.add('d-none');
    document.querySelector('#gameField').classList.remove('d-none');
    randomizePokemon();


}

function startMusic(){
    
}

function randomizePokemon() {
    console.log('randomizePokemon()')
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
    
}

// I denna fil skriver ni all er kod
log(new Date());