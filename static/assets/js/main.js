const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
var tempValue, pHValue, turbValue;
var TEMPMAX, TEMPMIN, PHMAX, PHMIN, turbMAX, turbMIN;
//Đọc các giá trị từ firebase
export const tempRef = firebase.database().ref('temp');
export const pHRef = firebase.database().ref('pH');
export const turbRef = firebase.database().ref('turb');
export const TempMaxRef = firebase.database().ref('temp-max');
export const TempMinRef = firebase.database().ref('temp-min');
export const PHMaxRef = firebase.database().ref('ph-max');
export const PHMinRef = firebase.database().ref('ph-min');
export const turbMaxRef = firebase.database().ref('turb-max');
export const turbMinRef = firebase.database().ref('turb-min');
const SizeRef = firebase.database().ref('size');
const delayRef = firebase.database().ref('delay');
const DayStart = firebase.database().ref('day-start');
const MonthStart = firebase.database().ref('month-start');
const YearStart = firebase.database().ref('year-start');
const DateStart = firebase.database().ref('date-start');
const inputs = {
  TempMaxInput: $('#temp-max-input'),
  TempMinInput: $('#temp-min-input'),
  PHMaxInput: $('#ph-max-input'),
  PHMinInput: $('#ph-min-input'),
  turbMaxInput: $('#turb-max-input'),
  turbMinInput: $('#turb-min-input'),
  sizeInput: $('#size-input'),
  delayInput: $('#delay-input'),
};
const SizeEditor = {
  inputElement: inputs.sizeInput,
  buttonElement: $('#size-btn'),
  displayElement: $('#size'),
  firebaseRef: SizeRef,
  toggleElement: $('#toggle-size'),
  displayText: (value) => value + 'mm',
};
const DelayEditor = {
  inputElement: inputs.delayInput,
  buttonElement: $('#delay-btn'),
  displayElement: $('.delay-value'),
  firebaseRef: delayRef,
  toggleElement: $("#toggle-delay"),
  displayText: (value) => value + 's',
};
const tempEditor = {
  MaxInput: inputs.TempMaxInput,
  MinInput: inputs.TempMinInput,
  toggleElement: $('#toggle-temp'),
  buttonElement: $('#temp-btn'),
  firebaseMaxRef: TempMaxRef,
  firebaseMinRef: TempMinRef,
  MaxValueElement: $('#temp-max-value'),
  MinValueElement: $('#temp-min-value'),
  displayText: (value) => value,
};
const phEditor = {
  MaxInput: inputs.PHMaxInput,
  MinInput: inputs.PHMinInput,
  toggleElement: $('#toggle-ph'),
  buttonElement: $('#ph-btn'),
  firebaseMaxRef: PHMaxRef,
  firebaseMinRef: PHMinRef,
  MaxValueElement: $('#ph-max-value'),
  MinValueElement: $('#ph-min-value'),
  displayText: (value) => value,
};
const turbEditor = {
  MaxInput: inputs.turbMaxInput,
  MinInput: inputs.turbMinInput,
  toggleElement: $('#toggle-turb'),
  buttonElement: $('#turb-btn'),
  firebaseMaxRef: turbMaxRef,
  firebaseMinRef: turbMinRef,
  MaxValueElement: $('#turb-max-value'),
  MinValueElement: $('#turb-min-value'),
  displayText: (value) => value,
};

const app = {
  // get Parameter form FireBase 
  getParameterToFireBase() {
    const RefArray = [TempMaxRef, TempMinRef, PHMaxRef, PHMinRef, turbMaxRef, turbMinRef,SizeRef, delayRef,];
    tempRef.on('value', function (snapshot) {
      tempValue = snapshot.val();
      $('#temp-val').innerHTML = tempValue.toFixed(1) + '°C';
    });
    pHRef.on('value', function (snapshot) {
      pHValue = snapshot.val();
      $('#ph-val').innerHTML = pHValue.toFixed(1);
    });
    turbRef.on('value', function (snapshot) {
      turbValue = snapshot.val();
      $('#turb-val').innerHTML = turbValue;
    });
    RefArray.forEach((ref, index) => {
      ref.on('value', (snapshot) => {
        const inputKey = Object.keys(inputs)[index];
        inputs[inputKey].value =snapshot.val();
      });
    });
  },
  // hàm xử lý sự kiện chỉnh sửa dashboard
  HandleEditor(){
    const toggle = [SizeEditor.toggleElement,DelayEditor.toggleElement,$('#toggle-time'),tempEditor.toggleElement,phEditor.toggleElement,turbEditor.toggleElement]
    $('.calendar').classList.toggle('mt-4');
    $('.date-cofig').classList.toggle('mt-4');
    $('#toggle-edit').addEventListener('click',function() {
      $('.calendar').classList.toggle('mt-4');
      $('.date-cofig').classList.toggle('mt-4');
      toggle.forEach(ref => {
        ref.classList.toggle('hidden');
      })
    });
    $('.calendar').classList.add('mt-4');
  },
  //Xử lý sự kiện chỉnh sửa kích thước và thời gian lấy mẫu
  setupEditor1(editor) {
    editor.firebaseRef.on('value', (snapshot) => {
      const value = snapshot.val();
      editor.displayElement.textContent = editor.displayText(value);
    });
    editor.toggleElement.addEventListener('click', () => {
      editor.buttonElement.classList.toggle('hidden');
      editor.displayElement.classList.toggle('hidden');
      editor.inputElement.classList.toggle('hidden');
      editor.inputElement.focus();
    });
    editor.buttonElement.addEventListener('click', () => {
      editor.buttonElement.classList.toggle('hidden');
      const newValue = editor.inputElement.value;
      editor.firebaseRef.set(newValue);
      editor.displayElement.textContent = editor.displayText(newValue);
      editor.inputElement.classList.toggle('hidden');
      editor.displayElement.classList.toggle('hidden');
    });
  },
  //xử lý sự kiện chỉnh sửa thời gian thả
  HandleEditTime() {
    const _this = this;
    $('#toggle-time').addEventListener('click', function () {
      $('#time-btn').classList.toggle('hidden');
      $('.print-time').classList.toggle('hidden')
      $('#date-input').classList.toggle('hidden')
    });
    $('#time-btn').addEventListener('click', function () {
      _this.GetDateToFireBase();
      _this.PushDateToFireBase();
      $('#time-btn').classList.toggle('hidden')
      $('#date-input').classList.toggle('hidden')
      $('.print-time').classList.toggle('hidden')
    });
  },
  //hàm lấy các giá trị ngày/tháng/năm từ firebase
  GetDateToFireBase() {
    DayStart.on('value', function (snapshot) {
      const DayValue = snapshot.val();
      $(".day-start").innerHTML = DayValue + '/';
    });
    MonthStart.on('value', function (snapshot) {
      const MonthValue = snapshot.val();
      $(".month-start").innerHTML = MonthValue + '/';
    });
    YearStart.on('value', function (snapshot) {
      const YearValue = snapshot.val();
      $(".year-start").innerHTML = YearValue;
    });
    DateStart.on('value', function (snapshot) {
      const DateValue = snapshot.val();
      $('#day').textContent = DateValue;
    });
  },
  // hàm tính toán thời gian thả giống
  getSelectedDate() {
    const userDate = new Date($('#date-input').value);
    const currentDate = new Date();
    const day = userDate.getDate();
    const month = userDate.getMonth() + 1;
    const year = userDate.getFullYear();
    const timeDifference = userDate.getTime() - currentDate.getTime();
    const daysDifference = Math.abs(Math.floor(timeDifference / (1000 * 3600 * 24))) - 1;
    return { day, month, year, daysDifference };
  },
  //hàm gửi dữ liệu ngày/tháng/năm lên firebase
  PushDateToFireBase() {
    const selectedDate = this.getSelectedDate();
    DayStart.set(selectedDate.day);
    MonthStart.set(selectedDate.month);
    YearStart.set(selectedDate.year);
    DateStart.set(selectedDate.daysDifference);
  },
  //Xử lý sự kiện chỉnh sửa các giá trị cảm biến tối ưu
  setupEditor2(editor) {
    editor.firebaseMaxRef.on('value', (snapshot) => {
      const value = snapshot.val();
      editor.MaxValueElement.textContent = editor.displayText(value);
    });
    editor.firebaseMinRef.on('value', (snapshot) => {
      const value = snapshot.val();
      editor.MinValueElement.textContent = editor.displayText(value);
    });
    editor.toggleElement.addEventListener('click', () => {
      editor.buttonElement.classList.toggle('hidden');
      editor.MaxValueElement.classList.toggle('hidden');
      editor.MinValueElement.classList.toggle('hidden');
      editor.MaxInput.classList.toggle('hidden');
      editor.MinInput.focus();
      editor.MinInput.classList.toggle('hidden');
    });
    editor.buttonElement.addEventListener('click', () => {
      editor.buttonElement.classList.toggle('hidden');
      const newMaxValue = editor.MaxInput.value;
      const newMinValue = editor.MinInput.value;
      editor.firebaseMaxRef.set(newMaxValue);
      editor.firebaseMinRef.set(newMinValue);
      editor.MaxValueElement.textContent = editor.displayText(newMaxValue);
      editor.MinValueElement.textContent = editor.displayText(newMinValue);
      editor.MaxInput.classList.toggle('hidden');
      editor.MinInput.classList.toggle('hidden');
      editor.MaxValueElement.classList.toggle('hidden');
      editor.MinValueElement.classList.toggle('hidden');
    });
  },
  //hàm hiển thị giá trị dự đoán máy học
  HandleSavePredictions(MaxRef, MinRef, valueMax, ValueMin) {
    MaxRef.set(valueMax);
    MinRef.set(ValueMin);
  },
  //hàm cập nhật các cảnh báo khi vượt ngưỡng
  updateNote(MaxRef, MinRef, Content, MAX, MIN, MaxContent, MinContent, NormalContent, Value) {
    MaxRef.on('value', function (snapshot) {
      MAX = snapshot.val();
      if (MAX < Value) {
        Content.innerHTML = `<div style = "color : red">${MaxContent}
        <span><a href="https://biogency.com.vn/12-chi-tieu-moi-truong-ao-nuoi-tom-can-biet/" target="_blank">See more</a></span>
        </div>`
      }
      else if (MAX >= Value) {
        Content.style.color = 'green';
        Content.textContent = NormalContent
      }
    });
    MinRef.on('value', function (snapshot) {
      MIN = snapshot.val();
      if (MIN > Value) {
        Content.innerHTML = `<div style = "color : red">${MinContent}
        <span><a href="https://biogency.com.vn/12-chi-tieu-moi-truong-ao-nuoi-tom-can-biet/" target="_blank">See more</a></span>
        </div>`
      }
    });
  },
  //hiển thị tiêu đề cảnh báo
  updateNoteContent() {
    //temp
    const tempContent = $("#temp-content");
    var noteTempMax = 'Nhiệt độ nước QUÁ CAO. '
    var noteTempMin = 'Nhiệt độ nước QUÁ THẤP. '
    var noteTempNormal = 'Nhiệt độ ổn định'
    //ph
    const phContent = $("#ph-content");
    var notephMax = 'Độ pH nước QUÁ CAO... '
    var notephMin = 'Độ pH nước QUÁ THẤP... '
    var notephNormal = 'Độ PH ổn định'
    //turb
    const turbContent = $("#turb-content");
    var noteturbMax = 'Độ đục QUÁ CAO... '
    var noteturbMin = 'Độ đục QUÁ THẤP... '
    var noteturbNormal = 'Độ đục của nước ổn định'
    this.updateNote(TempMaxRef, TempMinRef, tempContent, TEMPMAX, TEMPMIN, noteTempMax, noteTempMin, noteTempNormal, tempValue)
    this.updateNote(PHMaxRef, PHMinRef, phContent, PHMAX, PHMIN, notephMax, notephMin, notephNormal, pHValue)
    this.updateNote(turbMaxRef, turbMinRef, turbContent, turbMAX, turbMIN, noteturbMax, noteturbMin, noteturbNormal, turbValue)
  },
  // hàm xử lý và hiển thị thời gian thực
  updateTime() {
    const now = new Date();
    // Update date
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = now.getDate().toString().padStart(2, '0');
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();

    $('.day-name').textContent = dayName;
    $('.day-number').textContent = dayNumber;
    $('.month-name').textContent = monthName;
    $('.year').textContent = year;

    // Update time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    $('.hour').textContent = hours;
    $('.minutes').textContent = minutes;
    $('.seconds').textContent = seconds;
    document.querySelector('.period').textContent = ampm;
  },
  //hàm dự đoán từ mô hình máy học
  HandlePredictions() {
    const _this = this;
    $("#predict-btn").addEventListener("click", function () {
      var size, DateValue;
      DateStart.on('value', function (snapshot) {
        DateValue = snapshot.val();
      });
      SizeRef.on('value', function (snapshot) {
        size = snapshot.val();
      });
      var data = {
        "new_data_point": [[DateValue, size]]
      };
      // Sử dụng AJAX hoặc Fetch để gửi dữ liệu lên server
      fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(prediction => {
          var temp = parseFloat(prediction[0][0].toFixed(1)); // Lấy giá trị đầu tiên và làm tròn
          var TempMax = temp + 0.5;
          var TempMin = temp - 0.5;
          _this.HandleSavePredictions(TempMaxRef, TempMinRef, TempMax, TempMin);

          var pH = parseFloat(prediction[0][1].toFixed(1));    // Lấy giá trị thứ hai và làm tròn
          var pHMax = pH + 0.2;
          var pHMin = pH - 0.2;
          _this.HandleSavePredictions(PHMaxRef, PHMinRef, pHMax, pHMin);

          var turb = parseInt(prediction[0][2].toFixed(0));  // Lấy giá trị thứ ba và làm tròn
          var turbMax = turb + 2;
          var turbMin = turb - 2;
          _this.HandleSavePredictions(turbMaxRef, turbMinRef, turbMax, turbMin);
        })
        .catch(error => {
          console.error("Lỗi khi gửi dữ liệu:", error);
        });
    });
  },
  //hàm khởi chạy các chương trình con
  Start() {
    setInterval(() => {
      this.updateNoteContent();
    }, 3000);
    setInterval(this.updateTime, 1000);
    this.GetDateToFireBase();
    this.HandleEditor();
    this.getParameterToFireBase();
    this.setupEditor1(SizeEditor);
    this.setupEditor1(DelayEditor);
    this.HandleEditTime();
    this.setupEditor2(tempEditor);
    this.setupEditor2(phEditor);
    this.setupEditor2(turbEditor);
    this.HandlePredictions();
  }
}
app.Start();
