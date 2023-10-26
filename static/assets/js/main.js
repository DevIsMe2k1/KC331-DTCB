const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
var newSizeValue, tempValue, pHValue, DirtyValue;
var TEMPMAX, TEMPMIN, PHMAX, PHMIN, DIRTYMAX, DIRTYMIN;
const TempMaxRef = firebase.database().ref('temp-max');
const TempMinRef = firebase.database().ref('temp-min');
const TempMaxInput = $('#temp-max-input');
const TempMinInput = $('#temp-min-input');
const PHMaxRef = firebase.database().ref('ph-max');
const PHMinRef = firebase.database().ref('ph-min');
const PHMaxInput = $('#ph-max-input');
const PHMinInput = $('#ph-min-input');
const DIRTYMaxRef = firebase.database().ref('dirty-max');
const DIRTYMinRef = firebase.database().ref('dirty-min');
const DirtyMaxInput = $('#dirty-max-input');
const DirtyMinInput = $('#dirty-min-input');
const SizeRef = firebase.database().ref('size');
const DayStart = firebase.database().ref('day-start');
const MonthStart = firebase.database().ref('month-start');
const YearStart = firebase.database().ref('year-start');
const DateStart = firebase.database().ref('date-start');
const editBtn = $('#edit-btn');
const exitBtn = $('.exit');
const toggleSize = $('#toggle-size')
const toggleTime = $('#toggle-time')
const toggleTemp = $('#toggle-temp');
const togglePH = $('#toggle-ph');
const toggleDirty = $('#toggle-dirty')
const app = {
  // get Parameter form FireBase
  getParameterToFireBase() {
    const tempRef = firebase.database().ref('temp');
    const pHRef = firebase.database().ref('pH');
    const DirtyRef = firebase.database().ref('dirty');
    tempRef.on('value', function (snapshot) {
      tempValue = snapshot.val();
      $('#temp-val').innerHTML = tempValue.toFixed(1) + '°C';
    });
    pHRef.on('value', function (snapshot) {
      pHValue = snapshot.val();
      $('#ph-val').innerHTML = pHValue.toFixed(1);
    });
    DirtyRef.on('value', function (snapshot) {
      DirtyValue = snapshot.val();
      $('#dirty-val').innerHTML = DirtyValue;
    });
    SizeRef.on('value', function (snapshot) {
      const SizeLive = snapshot.val();
      $("#size").innerHTML = SizeLive + 'mm';
      $('#size-form-content').innerHTML = `<input type="number" id="size-input" style = "width:60px;"value="${SizeLive}">`;
    });
    TempMaxRef.on('value', function (snapshot) {
      TempMaxInput.value = snapshot.val()
    });
    TempMinRef.on('value', function (snapshot) {
      TempMinInput.value = snapshot.val()
    });
    PHMaxRef.on('value', function (snapshot) {
      PHMaxInput.value = snapshot.val()
    });
    PHMinRef.on('value', function (snapshot) {
      PHMinInput.value = snapshot.val()
    });
    DIRTYMaxRef.on('value', function (snapshot) {
      DirtyMaxInput.value = snapshot.val()
    });
    DIRTYMinRef.on('value', function (snapshot) {
      DirtyMinInput.value = snapshot.val()
    });
  },
  //size editor
  HandleEditSize() {
    const sizeBtn = $('#size-btn');
    const size = $('#size');
    const sizeFormContent = $('#size-form-content');
    const sizeInput = $("#size-input");
    toggleSize.addEventListener('click', function () {
      sizeBtn.classList.toggle('hidden');
      size.classList.toggle("hidden");
      sizeFormContent.classList.toggle("hidden");
      sizeInput.focus();
    });
    sizeBtn.addEventListener('click', function () {
      sizeBtn.classList.toggle('hidden')
      newSizeValue = $("#size-input").value;
      SizeRef.set(newSizeValue);
      size.textContent = newSizeValue + 'mm';
      sizeFormContent.classList.toggle("hidden");
      size.classList.toggle("hidden");
    });
  },
  //edit time
  HandleEditTime() {
    const TimeBtn = $('#time-btn');
    const Time = $('.print-time');
    const DateInput = $('#date-input');
    const _this = this;
    toggleTime.addEventListener('click', function () {
      TimeBtn.classList.toggle('hidden');
      Time.classList.toggle('hidden')
      DateInput.classList.toggle('hidden')
    });
    TimeBtn.addEventListener('click', function () {
      _this.GetDateToFireBase();
      _this.PushDateToFireBase();
      TimeBtn.classList.toggle('hidden')
      DateInput.classList.toggle('hidden')
      Time.classList.toggle('hidden')
    });
  },
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
  getSelectedDate() {
    const dateInput = $("#date-input");
    const userDate = new Date(dateInput.value);
    const currentDate = new Date();
    const day = userDate.getDate();
    const month = userDate.getMonth() + 1;
    const year = userDate.getFullYear();
    const timeDifference = userDate.getTime() - currentDate.getTime();
    const daysDifference = Math.abs(Math.floor(timeDifference / (1000 * 3600 * 24))) - 1;
    return { day, month, year, daysDifference };
  },
  PushDateToFireBase() {
    const selectedDate = this.getSelectedDate();
    DayStart.set(selectedDate.day);
    MonthStart.set(selectedDate.month);
    YearStart.set(selectedDate.year);
    DateStart.set(selectedDate.daysDifference);
  },
  //parameter defaults
  HandleEditBtn(editBtn, SaveBtn, MaxVal, MinVal, MaxInput, MinInput) {
    editBtn.addEventListener('click', function () {
      SaveBtn.classList.toggle('hidden');
      MaxVal.classList.toggle("hidden");
      MinVal.classList.toggle("hidden");
      MaxInput.classList.toggle("hidden");
      MaxInput.focus();
      MinInput.classList.toggle("hidden");
    });
  },
  HandleSaveBtn(MaxRef, MinRef, SaveBtn, MaxVal, MinVal, MaxInput, MinInput) {
    SaveBtn.addEventListener('click', function () {
      SaveBtn.classList.toggle('hidden')
      const newMaxValue = MaxInput.value;
      const newMinValue = MinInput.value;
      MaxRef.set(newMaxValue);
      MinRef.set(newMinValue);
      MaxVal.textContent = newMaxValue;
      MinVal.textContent = newMinValue;
      MaxInput.classList.toggle("hidden");
      MinInput.classList.toggle("hidden");
      MaxVal.classList.toggle("hidden");
      MinVal.classList.toggle("hidden");
    });
  },
  HandleSavePredictions(MaxRef, MinRef,valueMax,ValueMin){
    MaxRef.set(valueMax);
    MinRef.set(ValueMin);
  },
  //edit temp.
  HandleEditTemp() {
    TempMaxRef.on('value', function (snapshot) {
      TEMPMAX = snapshot.val();
      $('#temp-max-value').innerHTML = TEMPMAX;
    });
    TempMinRef.on('value', function (snapshot) {
      TEMPMIN = snapshot.val();
      $('#temp-min-value').innerHTML = TEMPMIN;
    });
    this.HandleEditBtn(toggleTemp, $('#temp-btn'), $('#temp-max-value'), $('#temp-min-value'), TempMaxInput, TempMinInput)
    this.HandleSaveBtn(TempMaxRef, TempMinRef, $('#temp-btn'), $('#temp-max-value'), $('#temp-min-value'), TempMaxInput, TempMinInput);
  },
  //edit ph
  HandleEditPH() {
    PHMaxRef.on('value', function (snapshot) {
      PHMAX = snapshot.val();
      $('#ph-max-value').innerHTML = PHMAX;
    });
    PHMinRef.on('value', function (snapshot) {
      PHMIN = snapshot.val();
      $('#ph-min-value').innerHTML = PHMIN;
    });
    this.HandleEditBtn(togglePH, $('#ph-btn'), $('#ph-max-value'), $('#ph-min-value'), PHMaxInput, PHMinInput)
    this.HandleSaveBtn(PHMaxRef, PHMinRef, $('#ph-btn'), $('#ph-max-value'), $('#ph-min-value'), PHMaxInput, PHMinInput);
  },
  //dirty
  HandleEditDirty() {
    DIRTYMaxRef.on('value', function (snapshot) {
      DIRTYMAX = snapshot.val();
      $('#dirty-max-value').innerHTML = DIRTYMAX;
    });
    DIRTYMinRef.on('value', function (snapshot) {
      DIRTYMIN = snapshot.val();
      $('#dirty-min-value').innerHTML = DIRTYMIN;
    });
    this.HandleEditBtn(toggleDirty, $('#dirty-btn'), $('#dirty-max-value'), $('#dirty-min-value'), DirtyMaxInput, DirtyMinInput)
    this.HandleSaveBtn(DIRTYMaxRef, DIRTYMinRef, $('#dirty-btn'), $('#dirty-max-value'), $('#dirty-min-value'), DirtyMaxInput, DirtyMinInput);
  },
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
    //dirty
    const DirtyContent = $("#dirty-content");
    var noteDirtyMax = 'Độ đục QUÁ CAO... '
    var noteDirtyMin = 'Độ đục QUÁ THẤP... '
    var noteDirtyNormal = 'Độ đục của nước ổn định'

    this.updateNote(TempMaxRef, TempMinRef, tempContent, TEMPMAX, TEMPMIN, noteTempMax, noteTempMin, noteTempNormal, tempValue)
    this.updateNote(PHMaxRef, PHMinRef, phContent, PHMAX, PHMIN, notephMax, notephMin, notephNormal, pHValue)
    this.updateNote(DIRTYMaxRef, DIRTYMinRef, DirtyContent, DIRTYMAX, DIRTYMIN, noteDirtyMax, noteDirtyMin, noteDirtyNormal, DirtyValue)
  },
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
  HandlePredictions() {
    const _this=this;
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
          _this.HandleSavePredictions(PHMaxRef, PHMinRef, pHMax,pHMin);

          var turb = parseInt(prediction[0][2].toFixed(0));  // Lấy giá trị thứ ba và làm tròn
          var turbMax = turb + 2;
          var turbMin = turb - 2; 
          _this.HandleSavePredictions(DIRTYMaxRef, DIRTYMinRef,turbMax, turbMin);
        })
        .catch(error => {
          console.error("Lỗi khi gửi dữ liệu:", error);
        });
    });
  },
  Start() {
    setInterval(() => {
      this.updateNoteContent();
    }, 3000);
    setInterval(this.updateTime, 1000);
    this.GetDateToFireBase();
    this.getParameterToFireBase();
    this.HandleEditSize();
    this.HandleEditTime();
    this.HandleEditTemp();
    this.HandleEditPH();
    this.HandleEditDirty();
    this.HandlePredictions();
  }
}
app.Start();


