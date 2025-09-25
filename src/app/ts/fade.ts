import { Renderer2 } from "@angular/core";

enum fade_mode {
    FADE_IN,
    FADE_OUT        
}

export class Fade {
    
    private mode : number = fade_mode.FADE_IN
    constructor(){}

    toggle(target : HTMLElement, renderer : Renderer2, max_opacity : number = 1){
        let sty = getComputedStyle(target)
        let opacity = parseFloat(sty.getPropertyValue('opacity'))
        if(opacity){
            this.fade_out(target, renderer)
        } else {
            this.fade_in(target, renderer, max_opacity)
        }
    }

    fade_in(target : HTMLElement, renderer : Renderer2, max_opacity : number = 1){
        this.mode = fade_mode.FADE_IN
        let do_fade_in = ()=>{
            let sty = getComputedStyle(target)
            let opacity = parseFloat(sty.getPropertyValue('opacity'))
            if(this.mode != fade_mode.FADE_IN || opacity >= max_opacity){
                return
            }
            renderer.setStyle(target, "opacity", `${opacity+0.1}`)
            requestAnimationFrame(do_fade_in)    
        }
        requestAnimationFrame(do_fade_in)
    }

    fade_out(target : HTMLElement, renderer : Renderer2){
        this.mode = fade_mode.FADE_OUT
        let do_fade_out = ()=>{
            let sty = getComputedStyle(target)
            let opacity = parseFloat(sty.getPropertyValue('opacity'))
            if(this.mode != fade_mode.FADE_OUT || opacity <= 0){
                return
            }
            renderer.setStyle(target, "opacity", `${opacity-0.1}`)
            requestAnimationFrame(do_fade_out)    
        }
        requestAnimationFrame(do_fade_out)
    }
}