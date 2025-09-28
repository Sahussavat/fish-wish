import { Renderer2 } from "@angular/core";
import { Fade } from '../ts/fade'


export class Kratong {
    private width_size : number = 100
    private kratong_box : HTMLElement
    private k_message : HTMLElement 
    private message_opacity : number = 1
    private position_x : number = -this.width_size * 2
    private position_y : number = 0
    private on_toggle : CallableFunction | null = null

    private fade = new Fade()

    constructor(sender : string, wish_des : string, private parent : HTMLElement, private renderer: Renderer2, private height : number = 100
        , private size : number = 1, private z : number = 1){
        this.width_size *= this.size
        this.kratong_box = renderer.createElement('div')
        renderer.setStyle(this.kratong_box, 'width', `${this.width_size}px`)
        renderer.setStyle(this.kratong_box, 'height', `${this.width_size}px`)
        renderer.addClass(this.kratong_box, 'kratong-box')
        renderer.setStyle(this.kratong_box, 'z-index', this.z)
        renderer.setStyle(this.kratong_box, 'transform', `translate(${this.position_x}px, ${this.position_y}px)`)

        let clickable_box = renderer.createElement('div')
        renderer.setStyle(clickable_box, 'width', `${this.width_size}px`)
        renderer.setStyle(clickable_box, 'height', `${this.width_size}px`)
        renderer.addClass(clickable_box, 'clickable-box')

        this.k_message = renderer.createElement('div')
        this.renderer.listen(clickable_box, 'click', () => {
            this.toggle_message()
            if(this.on_toggle){
                this.on_toggle()
            }
        });
        let message_box_size_x = 300
        let message_box_size_y = 150
        renderer.setStyle(this.k_message, 'width', `${message_box_size_x}px`)
        renderer.setStyle(this.k_message, 'height', `${message_box_size_y}px`)
        renderer.addClass(this.k_message, 'k-message')
        renderer.setStyle(this.k_message, 'top', `${-message_box_size_y - 25}px`)
        renderer.setStyle(this.k_message, 'left', `${-Math.ceil(Math.abs(message_box_size_x - this.width_size) / 2) }px`)
        
        let p = renderer.createElement("textarea")
        renderer.addClass(p, 'message-text-area')

        let sender_name_box = renderer.createElement("div")
        renderer.addClass(sender_name_box, 'sender-name-box')
        renderer.setStyle(sender_name_box, 'width', `${this.width_size*2}px`)
        renderer.setStyle(sender_name_box, 'height', `${this.width_size/2}px`)
        renderer.setStyle(sender_name_box, 'left', `${-Math.ceil(Math.abs(this.width_size*2 - this.width_size) / 2) }px`)
        renderer.setStyle(sender_name_box, 'top', `${this.width_size + 10}px`)

        let sender_name = renderer.createElement("p")
        renderer.addClass(sender_name, 'sender-name')

        let img = renderer.createElement("img")
        renderer.setStyle(img, 'width', `${this.width_size}px`)
        renderer.setStyle(img, 'height', `${this.width_size}px`)
        renderer.setAttribute(img, 'src', '/imgs/kratongs/fish1Texture.png')

        renderer.appendChild(parent, this.kratong_box)
        renderer.appendChild(sender_name, renderer.createText(sender))
        renderer.appendChild(p, renderer.createText(wish_des))
        renderer.appendChild(this.k_message, p)
        renderer.appendChild(clickable_box, sender_name_box)
        renderer.appendChild(sender_name_box, sender_name)
        renderer.appendChild(this.kratong_box, this.k_message)
        renderer.appendChild(clickable_box, img)
        renderer.appendChild(this.kratong_box, clickable_box)
    }

    move_left(){
        this.renderer.setStyle(this.kratong_box, 'transform', `translate(${this.position_x}px, ${this.position_y}px)`)
        this.position_x = (this.position_x + 1)
        this.position_y = (Math.ceil(Math.sin(this.position_x * 0.01 + 10)* 15 + this.height) )
        this.visible()
    }

    set_on_toggle(callback : CallableFunction){
        this.on_toggle = callback
    }

    visible(){
        this.renderer.setStyle(this.kratong_box, 'visibility', 'visible')
    }

    remove_when_offscreen(){
        if(this.is_off_screen()){
            this.renderer.removeChild(this.parent, this.kratong_box)
        }
    }

    is_off_screen(){
        return window.innerWidth + this.width_size < this.position_x
    }

    get_kratong_box(){
        return this.kratong_box
    }

    toggle_message(){
        this.fade.toggle(this.k_message, this.renderer, this.message_opacity)
    }
}
