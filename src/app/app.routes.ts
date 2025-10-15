import { Routes } from '@angular/router';
import { MainPage } from './components/main_page/main_page.component';
import { KratongAllWish } from './components/kratong_all_wish/kratong_all_wish.component';
import { Constant } from './ts/constant';

export const routes: Routes = [
    {
        path: '',
        component: MainPage
    },
    {
        path: Constant.WISHES_PAGE_NAME,
        component: KratongAllWish
    },
];
