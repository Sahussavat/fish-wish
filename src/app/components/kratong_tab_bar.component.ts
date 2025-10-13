import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { CreditModal } from "./credit_modal.component";

@Component({
  selector: 'kratong-tab-bar',
  templateUrl: './kratong_tab_bar.component.html',
  imports:[ CommonModule, CreditModal ],
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