
const BMI_submit = document.querySelector('.BMI_submit'); //增加紀錄紐
// const data = JSON.parse(localStorage.getItem('BMI_record')) || [] ; //所有資訊的陣列
const BMI_record_delete = document.querySelector('.BMI_record_delete'); //刪除紀錄紐，擺在ul裡但限制點擊li才有效果
const result_return_area = document.querySelector('.result_div_hide'); //按下增加紀錄紐後要顯示的資訊跟復歸紐的設定區塊變數，默認display:none;
const BMI_record_list = document.querySelector('.BMI_record_list');
// 刷新content

firebase.database().ref('BMIData').on('value', (snapshot) => {
  let BMIData = [];
  let str = '';
  console.log(snapshot.val());
  snapshot.forEach((item) => {
    BMIData.push({
      content: item.val(),
      key: item.key,
    });
  });
  if(BMIData === []) {
    return;
  }
  BMIData.forEach((item,key) => {
    console.log(item);
    str+=`<li class="BMI_record_li ${item.content.color}" data-key="${item.key}"><span class="judge_text">${item.content.Judge}</span><span class="tag">BMI</span>${item.content.BMI}<span class="tag">Weight</span>${item.content.Height}<span class="unit">cm</span><span class="tag">Height</span>${item.content.Weight}<span class="unit">kg</span><span class="tag date_align">${item.content.Date}</span></li>`;
  })
  BMI_record_list.innerHTML = str ;
});



//點及'看結果'增加紀錄
BMI_submit.addEventListener('click',(e) => {
  e.preventDefault();
  let heightData = parseInt(document.querySelector('.inputHeight').value);//身高
  let weightData = parseInt(document.querySelector('.inputWeight').value);//體重
  let BMI = Math.floor((weightData/(heightData/100)**2)*100)/100; //BMI 藉由 Math.floor(num* 10**n )/n  -> num取小數點到第n位
  //時間取得
  let current_time = new Date();//建立新時間物件
  let time_record = current_time.getDate()+'-'+current_time.getMonth()+'-'+current_time.getFullYear()+' | '+current_time.getHours()+':'+current_time.getMinutes() //取得整份時間字串
  //資訊復歸紐區域的class設定和變數
  result_return_area.style.display = 'inline-block'
  BMI_submit.style.display = 'none';
  let BMI_value = document.querySelector('.BMI_value'); //要修改的BMI數值
  let result_judge_text =document.querySelector('.result_judge_text');//要修改的BMI判定
  //BMI標準和顏色鑑定
  let BMI_judge ='';
  let color_judge='';
  if(heightData <= 0 || weightData <= 0 || isNaN(heightData) || isNaN(weightData)) {
    alert('身高體重必須給予大於0的值');
    BMI_value.textContent = '無效' ;
    return;
  }
  if(BMI<18.50){
    result_return_area.classList.add('judge_color_blue');
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '過輕' ;
    BMI_judge ='過輕';
    color_judge = 'judge_blue';
  }
  else if(BMI<24){
    result_return_area.classList.add('judge_color_green')
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '理想' ;
    BMI_judge ='理想';
    color_judge = 'judge_green';
  }
  else if(BMI<27){
    result_return_area.classList.add('judge_color_orange_light');
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '過重' ;
    BMI_judge ='過重';
    color_judge = 'judge_orange_light';
  }
  else if(BMI<30){
    result_return_area.classList.add('judge_color_orange');
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '輕度肥胖' ;
    BMI_judge ='輕度肥胖';
    color_judge = 'judge_orange';
  }
  else if(BMI<35){
    result_return_area.classList.add('judge_color_orange_deep');
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '中度肥胖' ;
    BMI_judge ='中度肥胖';
    color_judge = 'judge_orange_deep';
  }
  else{
    result_return_area.classList.add('judge_color_red');
    BMI_value.textContent = BMI ;
    result_judge_text.textContent = '重度肥胖' ;
    BMI_judge ='重度肥胖';
    color_judge = 'judge_red';
  }
  //將以上資料push到data
  firebase.database().ref('BMIData').push({
    color:color_judge,
    Judge:BMI_judge,
    BMI:BMI,
    Height:heightData,
    Weight:weightData,
    Date: time_record
  });

});

BMI_record_delete.addEventListener('click',(e) => {
  if(e.target.nodeName === 'LI'){

    firebase.database().ref('BMIData').on('value', (snapshot) => {
      snapshot.forEach((item) => {
        if( e.target.dataset.key === item.key) {
          firebase.database().ref('BMIData').child(item.key).remove();
        }
      });
    });
  }
});



// 以下為 localStorage 寫法
// const BMI_submit = document.querySelector('.BMI_submit'); //增加紀錄紐
// const data = JSON.parse(localStorage.getItem('BMI_record')) || [] ; //所有資訊的陣列
// const BMI_record_delete = document.querySelector('.BMI_record_delete'); //刪除紀錄紐，擺在ul裡但限制點擊li才有效果
// const result_return_area = document.querySelector('.result_div_hide'); //按下增加紀錄紐後要顯示的資訊跟復歸紐的設定區塊變數，默認display:none;
// const BMI_record_list = document.querySelector('.BMI_record_list');

// update_content(data);

//頁面刷新函式
// function update_content(items){
//   var BMI_record_list = document.querySelector('.BMI_record_list')
//   var str = '';
//   for(var i =0 ; i<items.length ; i++){
//     str+= '<li class="BMI_record_li  '+items[i].color+' data-num ='+i+' ><span class="judge_text">'+items[i].Judge+'</span><span class="tag">BMI</span>'+items[i].BMI+'<span class="tag">Weight</span>'+items[i].Height+'<span class="unit">cm</span><span class="tag">Height</span>'+items[i].Weight+'<span class="unit">kg</span><span class="tag date_align">'+items[i].Date+'</span></li>' ;
//   }
//   BMI_record_list.innerHTML = str ;
// }


// function addData(e){
//   e.preventDefault(); //避免掉submit自動重新整理的特性
//   //要加入localStorage的資料們 BMI 體重 身高 時間
//   var heightData = parseInt(document.querySelector('.inputHeight').value);//身高
//   var weightData = parseInt(document.querySelector('.inputWeight').value);//體重
//   var BMI = Math.floor((weightData/(heightData/100)**2)*100)/100; //BMI 藉由 Math.floor(num* 10**n )/n  -> num取小數點到第n位
//   //時間取得
//   var current_time = new Date();//建立新時間物件
//   var time_record = current_time.getDate()+'-'+current_time.getMonth()+'-'+current_time.getFullYear()+' | '+current_time.getHours()+':'+current_time.getMinutes() //取得整份時間字串
//   //資訊復歸紐區域的class設定和變數
//   result_return_area.style.display = 'inline-block'
//   BMI_submit.style.display = 'none';
//   var BMI_value = document.querySelector('.BMI_value'); //要修改的BMI數值
//   var result_judge_text =document.querySelector('.result_judge_text');//要修改的BMI判定
//   //BMI標準和顏色鑑定
//   var BMI_judge ='';
//   var color_judge='';
//   if(heightData <= 0 || weightData <= 0 || isNaN(heightData) || isNaN(weightData)) {
//     alert('身高體重必須給予大於0的值');
//     BMI_value.textContent = '無效' ;
//     return;
//   }
//   if(BMI<18.50){
//     result_return_area.classList.add('judge_color_blue');
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '過輕' ;
//     BMI_judge ='過輕';
//     color_judge = 'judge_blue';
//   }
//   else if(BMI<24){
//     result_return_area.classList.add('judge_color_green')
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '理想' ;
//     BMI_judge ='理想';
//     color_judge = 'judge_green';
//   }
//   else if(BMI<27){
//     result_return_area.classList.add('judge_color_orange_light');
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '過重' ;
//     BMI_judge ='過重';
//     color_judge = 'judge_orange_light';
//   }
//   else if(BMI<30){
//     result_return_area.classList.add('judge_color_orange');
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '輕度肥胖' ;
//     BMI_judge ='輕度肥胖';
//     color_judge = 'judge_orange';
//   }
//   else if(BMI<35){
//     result_return_area.classList.add('judge_color_orange_deep');
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '中度肥胖' ;
//     BMI_judge ='中度肥胖';
//     color_judge = 'judge_orange_deep';
//   }
//   else{
//     result_return_area.classList.add('judge_color_red');
//     BMI_value.textContent = BMI ;
//     result_judge_text.textContent = '重度肥胖' ;
//     BMI_judge ='重度肥胖';
//     color_judge = 'judge_red';
//   }
//   //將以上資料push到data
//   data.push({
//     color:color_judge,
//     Judge:BMI_judge,
//     BMI:BMI,
//     Height:heightData,
//     Weight:weightData,
//     Date: time_record
//   });
//   localStorage.setItem('BMI_record',JSON.stringify(data));
//   update_content(data);
// }
//點擊清單刪除紀錄的陣列資料函式


// function deleteData(e){
//   if(e.target.nodeName !== 'LI'){
//     return;
//   }
//   var delete_record_num = e.target.dataset.num ;
//   data.splice(delete_record_num,1);
//   update_content(data);
//   localStorage.setItem('BMI_record',JSON.stringify(data));
// };

//監聽事件
// BMI_submit.addEventListener('click',addData);
// BMI_record_delete.addEventListener('click',deleteData);