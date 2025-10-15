import { TestBed } from "@angular/core/testing";
import { KratongForm } from "../app/components/kratong_form/kratong_form.component";

describe('KratongForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KratongForm],
      providers: [
        
      ],
    }).compileComponents();
  });

  it('should create input box', () => {
    const fixture = TestBed.createComponent(KratongForm);
    let sender_name = fixture.nativeElement.querySelector('#sender-name')
    let kratong_des = fixture.nativeElement.querySelector('#kratong-des')
    let kratong_img_i = fixture.nativeElement.querySelector('#kratong-img-i')
    expect(sender_name).toBeTruthy()
    expect(kratong_des).toBeTruthy()
    expect(kratong_img_i).toBeTruthy()
  });

  it('should assign input name correctly', () => {
    const fixture = TestBed.createComponent(KratongForm);
    fixture.detectChanges()
    let kratong_form = fixture.componentInstance
    let sender_name = fixture.nativeElement.querySelector('#sender-name')
    let kratong_des = fixture.nativeElement.querySelector('#kratong-des')
    let kratong_img_i = fixture.nativeElement.querySelector('#kratong-img-i')
    expect(sender_name.name).toBe(kratong_form.form_names.sender_name)
    expect(kratong_des.name).toBe(kratong_form.form_names.kratong_des)
    expect(kratong_img_i.name).toBe(kratong_form.form_names.kratong_pic_i)
  });

})