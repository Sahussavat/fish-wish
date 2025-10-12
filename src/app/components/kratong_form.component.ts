import { Component, Renderer2, ElementRef } from '@angular/core';
import { ErrType, Validation } from '../ts/validation'
import { SendedKratong } from '../ts/sended_kratong';
import { kratong_pics, get_kratong_pic } from '../ts/kratong_pic';

@Component({
  selector: 'kratong-form',
  templateUrl: './kratong_form.component.html',
  styleUrls: ['./kratong_form.component.css'],
})

export class KratongForm {
  private name : any
  private message : any
  private vald : Validation

  form_names = {
    sender_name:"entry.172556839",
    kratong_des:"entry.1400774218",
    kratong_pic_i:"entry.1482066356",
  }

  form_sent_to_url = "https://docs.google.com/forms/d/e/1FAIpQLSeDWFm4upLqYxQv2TR0AvQlX6OHreEOO02jNJc8levlY0U28A/formResponse"

  kratong_img_i = 0

  kra_pics = kratong_pics
  
 constructor(private renderer : Renderer2, private element : ElementRef){
    this.vald = new Validation(this.renderer)
 }

 public max_name = 10
 public max_message = 100

 ngOnInit(){
  this.name = this.element.nativeElement.querySelector('#sender-name');
  this.message = this.element.nativeElement.querySelector('#kratong-des');
  const hidden_iframe = this.element.nativeElement.querySelector('#hidden_iframe');
  hidden_iframe.onload = ()=> {
    SendedKratong.getInstance().set_kratong({
      sender_name: this.element.nativeElement.querySelector('#sender-name').value,
      kratong_des: this.element.nativeElement.querySelector('#kratong-des').value,
      kratong_pic_i: this.kratong_img_i
    })
    this.clear()
    let loader = this.element.nativeElement.querySelector('#loader')
    this.renderer.setStyle(loader, 'visibility', 'hidden')
  }
 }

 clear(){
  this.name.value = ''
  this.message.value = ''
  this.count_name()
  this.count_message()
  this.clear_kratong_pic()
 }

 count_name(){
    this.vald.count_message(this.name.value, this.max_name, this.element.nativeElement.querySelector('#sender-name-message'))
 }

 count_message(){
    this.vald.count_message(this.message.value, this.max_message, this.element.nativeElement.querySelector('#kratong-des-message'))
 }

 val_name(){
  return this.vald.validate(
      this.name.value, [ErrType.NOT_NULL, [ErrType.MAX_STRING, this.max_name]],
      this.element.nativeElement.querySelector('#sender-name-err')
    )
 }

 val_message(){
  return this.vald.validate(
      this.message.value, [ErrType.NOT_NULL, [ErrType.MAX_STRING, this.max_message]],
      this.element.nativeElement.querySelector('#kratong-des-err')
    )
 }

 validation(){
  let val_arr = [
    this.val_name(),
    this.val_message(),
  ]
  for(let i=0;i<val_arr.length;i++){
    if(!val_arr[i]){
      return false;
    }
  }
  return true
 }

 on_change_pic(i : number){
  let input_k_i = this.element.nativeElement.querySelector('#kratong-img-i')
  this.renderer.setAttribute(input_k_i, 'value', i+'')
  this.change_kratong_pic(i)
  this.kratong_img_i = i
 }

 change_kratong_pic(i : number){
  let img = this.element.nativeElement.querySelector('#kratong-img')
  this.renderer.setAttribute(img, 'src', 'imgs/kratongs/'+get_kratong_pic(i))
 }

 clear_kratong_pic(){
  this.change_kratong_pic(0)
  this.kratong_img_i = 0
 }

 async do_sumbit(){
  const form : any = document.querySelector('#kratong-form');
  if(this.validation()){
    let loader = this.element.nativeElement.querySelector('#loader')
    this.renderer.setStyle(loader, 'visibility', 'visible')
    form.submit()
  }
 }
}