import { Renderer2 } from "@angular/core";

enum ErrType{
  NOT_NULL,
  MAX_STRING,
}

export class Validation {
    constructor(private renderer : Renderer2){

    }

    validate(v : number | string, cond : Array<number | Array<number>>, label_err : HTMLElement | null = null){
        let check_is_pass = true
        if(label_err){
            label_err.innerHTML = ''
        }
        for(let i=0;i<cond.length;i++){
            if(!check_is_pass)
            break;
            let c = cond[i]
            let e_check
            let e_option : number | null = null
            if (Array.isArray(c)){
                e_check = c[0]
                e_option = c[1]
            } else {
                e_check = cond[i]
            }
            switch(e_check){
            case ErrType.NOT_NULL:
                if(check_is_pass)
                check_is_pass = (v+'') !== ''
                if(label_err && !check_is_pass){
                let text = this.renderer.createText('โปรดใส่ข้อมูล')
                this.renderer.appendChild(label_err, text)
                }
                break;
            case ErrType.MAX_STRING:
                if(check_is_pass && e_option && typeof v === "string")
                    check_is_pass = [...v].length <= e_option
                if(label_err && !check_is_pass){
                let text = this.renderer.createText('ตัวอักษรต้องน้อยกว่า '+e_option+" ตัว")
                this.renderer.appendChild(label_err, text)
                } 
                break;
            }
        }
        return check_is_pass
    }  

    count_message(message : string, max_message : number, message_label : HTMLElement){
        let len = [...message].length
        if(len > max_message){
            this.renderer.setStyle(message_label, 'color', 'red')
        } else {
            this.renderer.setStyle(message_label, 'color', '')
        }
        message_label.innerHTML = (len+'')
    }
}