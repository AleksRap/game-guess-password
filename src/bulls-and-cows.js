const readlineSync = require('readline-sync');

class GameBullsAndCows {
  static _numAttempts = 10;
  static _startRange = 100;
  static _endRange = 999999;

  static numUseAttempts = 0;

  static game() {
    this.numUseAttempts = 0;
    const pcNumber = randomInteger(this._startRange, this._endRange);
    const pcNumberLength = String(pcNumber).length;

    console.log('\x1b[36m%s\x1b[0m', `Компьютер задумал число из ${pcNumberLength} цифр. У тебя есть ${this._numAttempts} попыток, чтобы угадать его`);

    this._round(pcNumber, pcNumberLength);
  }
  static askStartGame() {
    while (true) {
      const startGame = readlineSync.question('Начнем игру? (y/n) ');

      if (startGame === 'y') break;
      if (startGame === 'n') console.log('Не может быть. Подумай еще раз');
      if (startGame !== 'n' && startGame !== 'y') console.log('Неизвестная команда');
    }
  }


  static _round(pcNumber, pcNumberLength) {
    if (this.numUseAttempts >= this._numAttempts) {
      console.log('\x1b[31m%s\x1b[0m', 'Попытки закончились. Вы проиграли!');
      console.log('\x1b[31m%s\x1b[0m', 'Загаданное число', pcNumber);
      if (!this._repeatGame()) return;
    }

    console.log('\x1b[33m%s\x1b[0m', `Число оставшихся попыток ${this._numAttempts - this.numUseAttempts}`);

    const userNumber = this._askNumber(pcNumberLength);

    const result = this._checkNum(pcNumber, userNumber);
    if (result.completeCoincidence) {
      console.log('\x1b[35m%s\x1b[0m', 'Ура!!! Вы угадали!');
      if (!this._repeatGame()) return;
    }

    const matchingNumbersInTheirPlaces = result.first;
    const matchingNumbersNoInTheirPlaces = result.second;

    console.group();
    console.log('\x1b[32m%s\x1b[0m', 'Совпавших цифр не на своих местах: ', `${matchingNumbersInTheirPlaces} из ${pcNumberLength}`);
    console.log('\x1b[32m%s\x1b[0m', 'Цифр на своих местах: ', `${matchingNumbersNoInTheirPlaces.length} (${matchingNumbersNoInTheirPlaces.join(', ')})`);
    console.groupEnd();

    this.numUseAttempts++;
    this._round(pcNumber, pcNumberLength);
  }
  static _repeatGame() {
    if (this._askRepeatGame()) {
      this.askStartGame();
      this.game();
    } else {
      console.log('Хорошего дня!');
      return false;
    }
  }
  static _askNumber(pcNumberLength) {
    let userNumber = readlineSync.question(`Какое число задумал компьютер? `);

    if (isNaN(+userNumber)) {
      console.log('\x1b[31m%s\x1b[0m', 'Введенное значение не является числом. Попробуйте снова');
      return this._askNumber(pcNumberLength);
    }

    if (userNumber.length !== pcNumberLength) {
      console.log('\x1b[31m%s\x1b[0m', `Загаданное число состоит из ${pcNumberLength} цифр, а ваше из ${userNumber.length}. Повторите ввод`);
      return this._askNumber(pcNumberLength);
    }

    return userNumber;
  }
  static _askRepeatGame() {
    const startGame = readlineSync.question('Поиграем снова? (y/n) ');

    if (startGame !== 'n' && startGame !== 'y') console.log('Неизвестная команда');
    return startGame === 'y';
  }
  static _checkNum(pcNumber, userNumber) {
    const arr1 =  pcNumber.toString().split('');
    const arr2 = userNumber.toString().split('');

    const resultFirstArr = arr1.filter((n, index) => (arr2.includes(n) && n !== arr2[index]));
    const resultSecondArr = arr1.filter((n, index) => n === arr2[index]);

    return {
      first: resultFirstArr.length,
      second: resultSecondArr,
      completeCoincidence: !(pcNumber - userNumber)
    }
  }
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}


GameBullsAndCows.askStartGame();
GameBullsAndCows.game();

// node bulls-and-cows.js

