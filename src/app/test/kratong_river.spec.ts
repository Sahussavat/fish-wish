import { TestBed } from '@angular/core/testing';
import { KratongRiver } from '../components/kratong_river.component';
import { Kratong } from '../ts/kratong';
import { Renderer2 } from '@angular/core';

describe('KratongRiver', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KratongRiver],
    }).compileComponents();
  });

  it('should create the Kratong River', () => {
    const fixture = TestBed.createComponent(KratongRiver);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('Kratong', () => {
    let renderer2Mock: jasmine.SpyObj<Renderer2>;
    
  beforeEach(async () => {
    renderer2Mock = jasmine.createSpyObj('Renderer2', ['setStyle', 'addClass', 'setAttribute'
        , 'appendChild', 'removeChild', 'createElement', 'listen', 'createText']);
    await TestBed.configureTestingModule({
      imports: [KratongRiver],
      providers: [
        { provide: Renderer2, useValue: renderer2Mock }, 
      ],
    }).compileComponents();
  });

  it('should kratong got delete when off right screen', () => {
    const fixture = TestBed.createComponent(KratongRiver);
    let screen = fixture.nativeElement.querySelector('#kratong-screen')
    let kratong = new Kratong("สมศักดฺ์", "ขอให้สุขขี", "0", screen, renderer2Mock)

    expect(kratong).toBeTruthy();
    let kratong_box = kratong.get_kratong_box()
    renderer2Mock.setStyle(kratong_box, 'transform', `translate(${window.innerWidth + kratong.get_width_size() + 1}px, ${0}px)`)
    kratong.remove_when_offscreen()
    expect(kratong_box).toBeFalsy();
  });
});