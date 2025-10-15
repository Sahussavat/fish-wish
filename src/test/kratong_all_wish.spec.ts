
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { KratongAllWish } from "../app/components/kratong_all_wish/kratong_all_wish.component";
import { to_google_format_res, create_first_row_json, create_mock_data_json, create_result } from "./googlesheetjson.spec";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

const count_row = [
    ["3"]
]

const count_first_row = [
    ['count']
]

let switch_res = 0

function custom_fetch(){
    switch (switch_res){
        case 0:
            switch_res += 1
            return Promise.resolve(
                    new Response(to_google_format_res(JSON.stringify(create_mock_data_json(count_first_row))), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    })
                )
        case 1:
            switch_res += 1
            return Promise.resolve(
                    new Response(to_google_format_res(JSON.stringify(create_mock_data_json(count_row))), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    })
                )
        case 2:
            switch_res += 1
            return Promise.resolve(
                    new Response(to_google_format_res(JSON.stringify(create_first_row_json())), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    })
                )
        default:
            switch_res = 0
            return Promise.resolve(
                    new Response(to_google_format_res(JSON.stringify(create_mock_data_json())), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    })
                )
    }
}

describe('KratongAllWish', () => {

    beforeAll(()=>{
        globalThis.fetch = custom_fetch
    })

    beforeEach(async ()=>{
        await TestBed.configureTestingModule({
            imports: [KratongAllWish],
            providers: [
                {
                provide: ActivatedRoute,
                useValue: {
                        queryParams: of({ page_i: '1' }),
                    },
                },
            ],
        }).compileComponents();
    })

    it('should create cards the same amount of retrieved data', fakeAsync(() => {
        const fixture = TestBed.createComponent(KratongAllWish);
        fixture.detectChanges()

        tick(1000)
        expect(fixture.debugElement.queryAll(By.css('.col')).length).toBe(create_result().length)
    }));
});