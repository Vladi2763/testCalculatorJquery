const combineArrays = (arr1, arr2) => {
  let result = [];

  for (let i = 0; i < arr1.length; i++) {
    result.push(+arr1[i] + +arr2[i]);
  }

  return result;
};

const fillArrayResult = (inputs, container) => {
  let outerArr = [];
  let flag = true;

  $(inputs).each((index, element) => {
    let arr = $(element).text().split(",");
    outerArr.push(arr);
  });

  for (let i = 0; i < outerArr.length; i++) {
    for (let j = 0; j < outerArr[i].length; j++) {
      if (isNaN(outerArr[i][j])) {
        $(inputs).each((index, element) => {
          $(element).text("");
        });
        addAlarmMessage(
          "Введены неверные данные, нужно ввести массив чисел",
          container
        );
        flag = false;
        break;
      }
    }
  }
  if (flag) {
    container.text(combineArrays(outerArr[0], outerArr[1]));
    removeAlarmMessage($(".alarmContainer"));
  }
};

const calculationMethods = (arg1, arg2, char) => {
  let result;

  switch (char) {
    case "+": {
      result = arg1 + arg2;
      break;
    }
    case "-": {
      result = arg1 - arg2;
      break;
    }
    case "*": {
      result = arg1 * arg2;
      break;
    }
    case "/": {
      result = (arg1 / arg2).toFixed(2);
      break;
    }
  }

  return result;
};

const addAlarmMessage = (text, element) => {
  if ($(".alarmContainer").length > 0) {
    $(".alarmContainer__message").text(text);
    return;
  }

  $(element).before(
    $("<div>", {
      class: "alarmContainer",
    })
      .append(
        $("<div>", {
          class: "alarmContainer__title",
          text: "Ошибка",
        })
      )
      .append(
        $("<div>", {
          class: "alarmContainer__message",
          text: text,
        })
      )
  );
};

const removeAlarmMessage = (element) => {
  $(element.length > 0) ? $(element).remove() : "";
};

const checkCurrentChar = (currentChar) => {
  if (
    currentChar === "+" ||
    currentChar === "-" ||
    currentChar === "*" ||
    currentChar === "/"
  ) {
    return true;
  } else {
    return false;
  }
};

class Calculator {
  _currentFlag = false;

  get currentFlag() {
    return this._currentFlag;
  }

  set currentFlag(value) {
    this._currentFlag = value;
  }

  get currentChar() {
    return this._currentChar;
  }

  set currentChar(value) {
    this._currentChar = value;
  }

  constructor() {
    const $button = $(".main_button");
    const $areaResult = $(".main__result");
    const $select = $(".main__select");
    const $inputs = $(".main__container_inputArea");
    this.currentChar = $(".main__select").val();

    $select.change((event) => {
      this.currentChar = event.target.value;

      if (event.target.value === "boolean deny") {
        $inputs.each((index, element) => {
          if (index >= 1) {
            $(element).addClass("hidden");
          }
        });
      } else {
        $inputs.each((index, element) => {
          $(element).removeClass("hidden");
        });
      }
      $areaResult.text("");
      removeAlarmMessage($(".alarmContainer"));
    });

    $button.click(() => {
      $areaResult.text("");

      for (let i = 0; i < $inputs.length; i++) {
        let input = $inputs[i];
        if (input.textContent.length < 1) {
          addAlarmMessage("Введены не все данные", $areaResult);
          return;
        }
        if (isNaN(input.textContent)) {
          this.currentFlag = false;
          break;
        } else {
          this.currentFlag = true;
        }
      }

      if (this.currentFlag && checkCurrentChar(this.currentChar)) {
        this.calculation(
          +$inputs[0].textContent,
          +$inputs[1].textContent,
          this.currentChar,
          $areaResult
        );
        removeAlarmMessage($(".alarmContainer"));
      } else if (!this.currentFlag && checkCurrentChar(this.currentChar)) {
        addAlarmMessage(
          "Введены неверные данные, нужно ввести числа",
          $areaResult
        );
      }

      if ($select.val() === "str plus str") {
        this.stringAddition(
          $inputs[0].textContent,
          $inputs[1].textContent,
          $areaResult
        );
        removeAlarmMessage($(".alarmContainer"));
      }

      if ($select.val() === "boolean deny") {
        if (
          $inputs[0].textContent === "true" ||
          $inputs[0].textContent === "false"
        ) {
          this.booleanDeny($inputs[0].textContent, $areaResult);
          removeAlarmMessage($(".alarmContainer"));
        } else {
          addAlarmMessage(
            "Введены неверные данные, нужно ввести логическое значение",
            $areaResult
          );
        }
      }

      if ($select.val() === "addion Array char by char") {
        this.additionOfArraysCharByChar($inputs, $areaResult);
      }

      $inputs.each((index, element) => {
        $(element).text("");
      });
    });
  }

  calculation(arg1, arg2, char, element) {
    $(element).text(calculationMethods(arg1, arg2, char));
  }

  stringAddition(arg1, arg2, element) {
    let sum = arg1 + arg2;

    $(element).text(sum);
  }

  booleanDeny(arg, element) {
    let newArg;

    if (arg === "true") {
      newArg = true;
    } else {
      newArg = false;
    }

    $(element).text(!newArg);
  }

  additionOfArraysCharByChar(inputs, element) {
    fillArrayResult($(inputs), $(element));
  }
}

let App = new Calculator();
