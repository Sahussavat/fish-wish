import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { GoogleSheetJSON, Data, OptionLoadData } from '../../ts/googlesheetjson';
import { SendedKratong, kratong_data } from '../../ts/sended_kratong';
import { Kratong } from '../../ts/kratong'
import { LoopObj } from '../../ts/loop_object';
import { Constant } from '../../ts/constant';

@Component({
  selector: 'kratong-river',
  templateUrl: './kratong_river.component.html',
  styleUrls: ['./kratong_river.component.css', '../krtatong_move.component.css'],
})

export class KratongRiver implements OnInit {
    
    private kratongs : Array<Kratong> = []
    private static KRATONG_SPEED = 1
    private static KRATONG_SPAWN_TIME = 300
    private static MAX_KRATONGS = 4
    private loop_arr : Array<LoopObj> = []

    private wish_arr : Array<Data> = []
    private temp_wish_arr : Array<Data> = []

    private current_reading : Kratong | null = null

    private is_loading_data = false;

    private previous_i : number | null = null

    private load_data_option : OptionLoadData = {
        sheet_name: Constant.SHEET_NAME,
        count_col: Constant.WHAT_COL_TO_GET_ALL_COUNT,
      } 

    constructor(private renderer: Renderer2, private elementRef: ElementRef){}

    ngOnInit(){
      this.load_data().then((d)=>{
        this.wish_arr = d
        this.start_loop()
      })
    }

    load_data(){
      return GoogleSheetJSON.load_data(Constant.SHEET_ID, (n : number)=> this.finding_start_n_end_i(n), this.load_data_option)
    }

    finding_start_n_end_i(n : number){
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

      return [ start, end ]
    }

    start_loop(){
      this.kratong_spawn(400, 1, 5)
      let do_timeout = new LoopObj(()=>{
        this.kratong_spawn(250, 0.75, 4)
      }, 100)
      do_timeout.running_timeout()
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
        let wish : Data | undefined | null 
        if(sended_kra){
          wish = {
            'ชื่อผู้ส่ง': sended_kra['sender_name'],
            'คำอวยพร': sended_kra['kratong_des'],
            'ภาพกระทง': ""+sended_kra['kratong_pic_i'],
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
        let kratong = new Kratong(wish['ชื่อผู้ส่ง'], wish['คำอวยพร'], wish['ภาพกระทง'], kratong_screen, this.renderer, h, size, z)
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