import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Validation } from "../ts/validation";
import { Renderer2, Type } from "@angular/core";
import { KratongForm } from "../components/kratong_form.component";
import { By } from "@angular/platform-browser";

describe('Validation', () => {
    let renderer2Mock: jasmine.SpyObj<Renderer2>;
    let renderer2 : Renderer2
    let fixture : ComponentFixture<KratongForm>
    let valid : Validation
    let kratong_form : KratongForm
    let check_len_label : HTMLElement
    let input_des : HTMLElement
    
  beforeEach(async () => {
        renderer2Mock = jasmine.createSpyObj('Renderer2', ['setStyle', 'addClass', 'setAttribute'
            , 'appendChild', 'removeChild', 'createElement', 'listen', 'createText', 'setProperty']);
        valid = new Validation(renderer2Mock)
        await TestBed.configureTestingModule({
            imports:[KratongForm]
        }).compileComponents();
        fixture = TestBed.createComponent(KratongForm);
        fixture.detectChanges()
        kratong_form = fixture.componentInstance
        check_len_label = fixture.debugElement.query(By.css("#kratong-des-message")).nativeElement;
        input_des = fixture.debugElement.query(By.css("#kratong-des")).nativeElement;
        renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    })
  
    describe('is_not_null', () => {
        it('should not null fn return true when string not empty', () => {
            expect(valid.is_not_null("not null")).toBeTrue()
        });

        it('should not null fn return false when string empty', () => {
            expect(valid.is_not_null("")).toBeFalse()
        });
    })
    
    describe('is_under_max_len', () => {
        it('should check length fn return true when inbound', () => {
            let max_len = 10
            expect(valid.is_under_max_len(5, max_len)).toBeTrue()
            expect(valid.is_under_max_len(-5, max_len)).toBeTrue()
        });

        it('should check length fn return false when not inbound', () => {
            let max_len = 10
            expect(valid.is_under_max_len(11, max_len)).toBeFalse()
        });

        it('should show red color when word length not inbound', () => {
            let err_text = "b"
            for(let i=0;i<kratong_form.max_message;i++){
                err_text += "b"
            }
            let testing_text = renderer2.createText(err_text)
            renderer2.setProperty(input_des, 'innerHTML', '');
            renderer2.appendChild(input_des, testing_text)
            kratong_form.val_message()
            kratong_form.count_message()
            
            const styles = getComputedStyle(check_len_label);
            expect(styles.color.replaceAll(' ', '')).toBe(valid.get_error_color())
        });

        it('should show default color when word length inbound', () => {
            let err_text = ""
            for(let i=0;i<kratong_form.max_message;i++){
                err_text += "b"
            }
            let testing_text = renderer2.createText(err_text)
            renderer2.setProperty(input_des, 'innerHTML', '');
            renderer2.appendChild(input_des, testing_text)
            kratong_form.val_message()
            kratong_form.count_message()
            
            const styles = getComputedStyle(check_len_label);
            expect(styles.color).not.toBe(valid.get_error_color())
        });
    })

});
