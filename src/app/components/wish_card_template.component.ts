import { Renderer2 } from '@angular/core';
import { Data } from '../ts/googlesheetjson';

function date_to_string(date : string = ""){
  let ret = date
  if(date !== ""){
    const d = new Date(parseInt(date + "")*1000);
    ret = d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }
  return ret
}

export function create_card(renderer: Renderer2, data_template : Data = {}){
  let data = {
    name: "ชื่อ",
    des: "คำอวยพร",
    date: "",
  }

  if (data_template){
    data.name = data_template['ชื่อผู้ส่ง']
    data.des = data_template['คำอวยพร']
    data.date = data_template['ประทับเวลา']
  }
  let card = renderer.createElement("div")
  renderer.addClass(card, "card-box")
  let div1 = renderer.createElement("div")
  renderer.addClass(div1, "inside-box")
  renderer.appendChild(card, div1)
  let div = renderer.createElement("div")
  renderer.addClass(div, "name-box")
  let p = renderer.createElement("p")
  let text = renderer.createText(data.name)
  renderer.appendChild(p, text)
  renderer.appendChild(div, p)
  renderer.appendChild(div1, div)
  let hr = renderer.createElement("hr")
  renderer.appendChild(div1, hr)

  div = renderer.createElement("div")
  renderer.addClass(div, "text-des-box")
  p = renderer.createElement("textarea")
  text = renderer.createText(data.des)
  renderer.appendChild(p, text)
  renderer.appendChild(div, p)
  renderer.appendChild(div1, div)
  hr = renderer.createElement("hr")
  renderer.appendChild(div1, hr)
  
  div = renderer.createElement("div")
  renderer.addClass(div, "data-box")
  p = renderer.createElement("p")
  if(data.date === ''){
    data.date = "ส่งเมื่อวันที่ วัน เดือน ปี"
  } 
  else {
    data.date = date_to_string(data.date)
  }
  text = renderer.createText(data.date)
  renderer.appendChild(p, text)
  renderer.appendChild(div, p)
  renderer.appendChild(div1, div)

  return card
}