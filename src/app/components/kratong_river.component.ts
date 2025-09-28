import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { GoogleSheetJSON, data } from '../ts/googlesheetjson';
import { SendedKratong, kratong_data } from '../ts/sended_kratong';
import { Kratong } from '../ts/kratong'
import { LoopObj } from '../ts/loop_object';

@Component({
  selector: 'kratong-river',
  templateUrl: './kratong_river.component.html',
  styleUrls: ['./kratong_river.style.css', './krtatong_move.style.css'],
})

export class KratongRiver implements OnInit {
    
    private kratongs : Array<Kratong> = []
    private static KRATONG_SPEED = 1
    private static KRATONG_SPAWN_TIME = 300
    private static MAX_KRATONGS = 4
    private loop_arr : Array<LoopObj> = []

    private wish_arr : Array<data> = []
    private temp_wish_arr : Array<data> = []

    private current_reading : Kratong | null = null

    private is_loading_data = false;

    private previous_i : number | null = null

    constructor(private renderer: Renderer2, private elementRef: ElementRef){}

    ngOnInit(){
      this.load_data().then((d)=>{
        this.wish_arr = d
        this.start_loop()
      })
    }

    load_data(){
      return new GoogleSheetJSON('1_f3xzqynXqxUMx2E1YkYZtXaOujZnvUnuHoIhMBU16w', {
            'sheetName': 'ชีต1',
        }, 'G', 'G').parse().then((d)=>{
            let n : number = parseInt(d[0]['count'])
            return n
        })
        .then((n)=>{
          if(!n){
            return []
          }
          let section_max = Math.floor(n/KratongRiver.MAX_KRATONGS)
          let section_i = Math.round((section_max - 1) * Math.random())
          let max_loop = 3
          let m_c = 0
          while(section_i === this.previous_i && section_max > 1 && m_c < max_loop){
            section_i = Math.round((section_max - 1) * Math.random())
            m_c++
          }
          this.previous_i = section_i
          let start = section_i * KratongRiver.MAX_KRATONGS + 1
          let end = Math.min(start + KratongRiver.MAX_KRATONGS - 1, n)
          console.log(start, end)
          return new GoogleSheetJSON('1_f3xzqynXqxUMx2E1YkYZtXaOujZnvUnuHoIhMBU16w', {
                'sheetName': 'ชีต1',
                'start': start,
                'end': end
          }).parse()
        })
    }

    start_loop(){
      this.kratong_spawn(400, 1, 5)
      setTimeout(()=>{
        this.kratong_spawn(250, 0.75, 4)
      }, 2500)
      this.kratong_animation_loop()
    }

    shuffleArray(array : any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  
        }
    return array;
    }

    kratong_spawn(h : number = 100, size : number = 1, z : number = 1){
      var kratong_screen = this.elementRef.nativeElement.querySelector('#kratong-screen')
      var do_spawn = ()=>{
        if(!this.temp_wish_arr.length){
            this.temp_wish_arr = this.shuffleArray([...this.wish_arr])
        }
        let sended_kra : kratong_data | null = null
        let s_k = SendedKratong.getInstance()
        if(s_k.is_have_data()){
          sended_kra = s_k.get_kratong()
        } 
        let wish : data | undefined | null 
        if(sended_kra){
          wish = {
            'ชื่อผู้ส่ง': sended_kra['sender_name'],
            'คำอวยพร': sended_kra['kratong_des']
          }
        } else {
          wish = this.temp_wish_arr.pop()
        }
        if(this.temp_wish_arr.length <= this.wish_arr.length / 2 && !this.is_loading_data){
          this.is_loading_data = true
          this.load_data().then((d)=>{
            this.wish_arr = d
            this.is_loading_data = false
          })
        }
        if(!wish){
            return
        }
        let kratong = new Kratong(wish['ชื่อผู้ส่ง'], wish['คำอวยพร'], kratong_screen, this.renderer, h, size, z)
        kratong.set_on_toggle(()=>{
          if(kratong != this.current_reading){
            if(this.current_reading){
              this.current_reading.toggle_message()
            }
            this.current_reading = kratong
            this.current_reading.toggle_message()
          } else {
            this.current_reading = null
          }
        })
        this.kratongs.push(kratong)
      }
      do_spawn()
      let lo = new LoopObj(do_spawn, KratongRiver.KRATONG_SPAWN_TIME)
      lo.running_loop()
      this.loop_arr.push(lo)
    }

    kratong_animation_loop(){
      var do_move_fn = ()=>{
        let k_temp = Array.from(this.kratongs)
        for(let i=0;i < k_temp.length;i++){
          let kartong = this.kratongs[i]
          if(!kartong){
            continue
          }
          kartong.move_left()
          kartong.remove_when_offscreen()
          if(kartong.is_off_screen()){
            this.kratongs.splice(this.kratongs.indexOf(kartong), 1)
          }
        }
      }
      let lo = new LoopObj(do_move_fn, KratongRiver.KRATONG_SPEED)
      lo.running_loop()
      this.loop_arr.push(lo)
    }

}