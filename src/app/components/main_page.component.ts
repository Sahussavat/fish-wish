import { Component, OnInit } from "@angular/core";
import { KratongRiver } from "./kratong_river.component";
import { KratongForm } from "./kratong_form.component";
import { KratongTabBar } from "./kratong_tab_bar.component";

@Component({
  selector: 'app-root',
  imports: [KratongRiver, KratongForm, KratongTabBar],
  templateUrl: './main_page.component.html',
})

export class MainPage implements OnInit {
  ngOnInit(){

  }
}
