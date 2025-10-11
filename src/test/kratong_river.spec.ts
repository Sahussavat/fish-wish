import { TestBed } from '@angular/core/testing';
import { KratongRiver } from '../components/kratong_river.component';
import { Kratong } from '../ts/kratong';
import { Renderer2, Type } from '@angular/core';

describe('KratongRiver', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KratongRiver],
      providers: [
        
      ],
    }).compileComponents();
  });

  it('should kratong got delete when off right screen', () => {
    const fixture = TestBed.createComponent(KratongRiver);
    let screen = fixture.nativeElement.querySelector('#kratong-screen')
    let renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    let kratong = new Kratong("สมศักดฺ์", "ขอให้สุขขี", "0", screen, renderer2)

    expect(kratong).toBeTruthy();
    let kratong_box = kratong.get_kratong_box()
    for(let i=0;i < window.innerWidth + kratong.get_width_size() * 4 + 1;i++){
      kratong.move_left()
    }
    kratong.remove_when_offscreen()
    expect(renderer2.parentNode(kratong_box)).toBeNull();
  });
});