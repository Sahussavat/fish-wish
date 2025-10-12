import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'kratong-tab-bar',
  templateUrl: './kratong_tab_bar.component.html',
  imports:[ CommonModule ],
  styleUrls: ['./kratong_tab_bar.component.css'],
})

export class KratongTabBar implements OnInit {
    currentUrl = '';

    wish_url = "wishes"

    constructor(private router: Router){}

    ngOnInit(){
        this.currentUrl = this.router.url
    }
}