import { Renderer2 } from "@angular/core";

export enum ErrType{
  NOT_NULL,
  MAX_STRING,
}

export class Validation {
    private error_color = "rgb(255,0,0)"

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
                    check_is_pass = this.is_not_null(v+'')
                if(label_err && !check_is_pass){
                    this.show_err_msg(this.get_not_null_err_msg(), label_err)
                }
                break;
            case ErrType.MAX_STRING:
                if(check_is_pass && e_option !== null && typeof v === "string"){
                    check_is_pass = this.is_under_max_len([...v].length, e_option)
                }
                if(label_err && !check_is_pass){
                    let max_len = e_option ? e_option :0 
                    this.show_err_msg(this.get_max_len_err_msg(max_len), label_err)
                } 
                break;
            }
        }
        return check_is_pass
    }  

    count_message(message : string, max_message : number, message_label : HTMLElement){
        let len = [...message].length
        if(!this.is_under_max_len(len, max_message)){
            this.renderer.setStyle(message_label, 'color', this.error_color)
        } else {
            this.renderer.setStyle(message_label, 'color', '')
        }
        this.renderer.setProperty(message_label, 'innerHTML', (len+''));
    }

    show_err_msg(text : string, label_err : HTMLElement){
        let t = this.renderer.createText(text)
        this.renderer.appendChild(label_err, t)
    }

    is_under_max_len(current_len : number, max_len : number){
        return current_len <= max_len
    }

    is_not_null(str : string){
        return str !== ''
    }

    get_max_len_err_msg(max_len : number | string){
        return 'ตัวอักษรต้องน้อยกว่า '+max_len+" ตัว"
    }

    get_not_null_err_msg(){
        return 'โปรดใส่ข้อมูล'
    }

    get_error_color(){
        return this.error_color;
    }
}