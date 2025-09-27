import { Component, Renderer2, ElementRef } from '@angular/core';
import {Validation } from '../ts/validation'
import { SendedKratong } from '../ts/sended_kratong';

enum ErrType{
  NOT_NULL,
  MAX_STRING,
}

@Component({
  selector: 'kratong-form',
  templateUrl: './kratong_form.component.html',
  styleUrls: ['./kratong_form.style.css'],
})

export class KratongForm {
  private name : any
  private message : any
  private vald : Validation
  
 constructor(private renderer : Renderer2, private element : ElementRef){
    this.vald = new Validation(this.renderer)
 }

 public max_name = 20
 public max_message = 200

 ngOnInit(){
  this.name = this.element.nativeElement.querySelector('#sender-name');
  this.message = this.element.nativeElement.querySelector('#kratong-des');
  const hidden_iframe = this.element.nativeElement.querySelector('#hidden_iframe');
  hidden_iframe.onload = ()=> {
    SendedKratong.getInstance().set_kratong({
      sender_name: this.element.nativeElement.querySelector('#sender-name').value,
      kratong_des: this.element.nativeElement.querySelector('#kratong-des').value
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

 async do_sumbit(){
  const form : any = document.querySelector('#kratong-form');
  if(this.validation()){
    form.submit()
    let loader = this.element.nativeElement.querySelector('#loader')
    this.renderer.setStyle(loader, 'visibility', 'visible')
  }
 }
}