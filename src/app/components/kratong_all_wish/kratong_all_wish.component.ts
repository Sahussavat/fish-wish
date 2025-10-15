import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { KratongTabBar } from "../kratong_tab_bar/kratong_tab_bar.component";
import { ActivatedRoute, Params } from "@angular/router";
import { Data, GoogleSheetJSON, OptionLoadData } from "../../ts/googlesheetjson";
import { create_card } from "../wish_card_template/wish_card_template.component";
import { Constant } from "../../ts/constant";

interface UlCreateData {
  href: string,
  text_content: string,
  check_condition_disable: boolean,
  check_condition_active: boolean,
}

@Component({
    selector: 'kratong-all-wish',
    templateUrl: './kratong_all_wish.component.html',
    imports: [KratongTabBar],
    styleUrls: ['./kratong_all_wish.component.css', '../wish_card_template/wish_card_template.component.css'],
})

export class KratongAllWish implements OnInit {

  private load_data_option : OptionLoadData = {
        sheet_name: Constant.SHEET_NAME,
        count_col: Constant.WHAT_COL_TO_GET_ALL_COUNT,
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private activateRoute: ActivatedRoute){}

  clamp(value : number, min : number, max : number) {
    return Math.min(Math.max(value, min), max);
  }

  ngOnInit() {
    let loading_card = this.elementRef.nativeElement.querySelector('#loading_card');
    this.activateRoute.queryParams
      .subscribe(params => {
        GoogleSheetJSON.load_data(Constant.SHEET_ID, (n : number)=>{
          this.renderer.setStyle(loading_card, "display", "flex")
          return this.callback_after_get_data_length(n, params)
        }, this.load_data_option).then((data : Data[])=>{
          if(data.length < 1){
            return
          }
          let card_table = this.elementRef.nativeElement.querySelector('#card_table');
          for(let i=0;i<data.length;i++){
            let col = this.renderer.createElement('div')
            this.renderer.addClass(col, "col")
            let card = create_card(this.renderer, data[i])
            this.renderer.appendChild(col, card)
            this.renderer.appendChild(card_table, col)
            this.renderer.setStyle(loading_card, "display", "none")
            this.renderer.setStyle(card_table, "display", "flex")
          }
        })
      }
    );
  }

  callback_after_get_data_length(n : number, params : Params){
    this.show_cards(n)
    let card_len = 9
    let max_page_n = Math.ceil(n / card_len)
    let page_i_p = 1
    if ('page_i' in params && !isNaN(Number(params['page_i'] + "")) ){
      page_i_p = parseInt(params['page_i'] + "")
      page_i_p = this.clamp(page_i_p, 1, max_page_n)
    }
    
    this.add_pagination(page_i_p, max_page_n)

    let start = ((page_i_p-1) * card_len) + 1
    let end = page_i_p * card_len + 1 - 1

    return [ start, end ]
  }

  show_cards(n : number){
    if (n < 1){
      let no_display = this.elementRef.nativeElement.querySelector('#no_display');
      this.renderer.setStyle(no_display, "display", "inline")
      return
    } else {
      let display_card = this.elementRef.nativeElement.querySelector('#display_card');
      this.renderer.setStyle(display_card, "display", "inline")
    }
  }

  create_pageination(current_page_i : number = 1, page_max : number = 0){
    if (page_max == 0){
      return
    }
    let nav = this.renderer.createElement('nav')
    let ul = this.renderer.createElement('ul')
    let i = current_page_i - 1 - Number(current_page_i >= page_max)
    let end_i = current_page_i + 1 + Number(current_page_i <= 1)
    let page_i_name = "page_i"
    this.add_link(ul, [this.get_data_for_create_btn_link(`./${Constant.WISHES_PAGE_NAME}?${page_i_name}=${1}`, '<<<', current_page_i <= 1),
      this.get_data_for_create_btn_link(`./${Constant.WISHES_PAGE_NAME}?${page_i_name}=${(current_page_i-1)}`, '<', current_page_i <= 1)])
    while(i <= end_i && i <= page_max){
      if(i > 0){
        this.add_link(ul, [this.get_data_for_create_btn_link(`./${Constant.WISHES_PAGE_NAME}?${page_i_name}=${i}`, ''+i, false, current_page_i == i)])
      }
      i++
    }
    this.add_link(ul, [this.get_data_for_create_btn_link(`./${Constant.WISHES_PAGE_NAME}?${page_i_name}=${current_page_i+1}`, '>', current_page_i >= page_max),
      this.get_data_for_create_btn_link(`./${Constant.WISHES_PAGE_NAME}?${page_i_name}=${page_max}`, '>>>', current_page_i >= page_max)])
    this.renderer.addClass(ul, 'pagination')
    this.renderer.addClass(ul, 'justify-content-center')
    this.renderer.appendChild(nav, ul)
    return nav
  }

  add_pagination(current_page_i : number = 1, page_max : number = 0){
    let pag_parent = this.elementRef.nativeElement.querySelectorAll('.pagnination-here')
    pag_parent.forEach((parent : HTMLElement)=>{
      this.renderer.appendChild(parent, this.create_pageination(current_page_i, page_max))
    })
  }

  add_link(ul : HTMLElement, data : UlCreateData[]){
    for(let i=0;i<data.length;i++){
      let d = data[i]
      let li = this.create_link(d.href,d.text_content)
      if(d.check_condition_disable){
        this.renderer.addClass(li, "disabled")
      }
      if(d.check_condition_active){
        this.renderer.addClass(li, "active")
      }
      this.renderer.appendChild(ul, li)
    }
  }

  get_data_for_create_btn_link(href: string, text_content: string,
     check_condition_disable: boolean, check_condition_active: boolean = false){
    return {
      href: href,
      text_content: text_content,
      check_condition_disable: check_condition_disable,
      check_condition_active: check_condition_active,
    }
  }

  create_link(href : string, text_content : string){
    let li = this.renderer.createElement('li')
    let a = this.renderer.createElement('a')
    this.renderer.addClass(li, 'page-item')
    this.renderer.addClass(a, 'page-link')
    this.renderer.appendChild(li, a)
    let text = this.renderer.createText(text_content)
    this.renderer.setAttribute(a, 'href', href)
    this.renderer.appendChild(a, text)
    return li
  }
  
} 