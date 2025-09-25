
export class LoopObj {
    private remaining_time : number = 0

    constructor(private callback : CallableFunction, private delay : number){}

    running_loop(){
        let do_loop = ()=>{
            this.remaining_time += 1
            if(this.remaining_time >= this.delay){
                this.remaining_time = 0
                this.callback()
            }
            requestAnimationFrame(do_loop)
        }
        requestAnimationFrame(do_loop)
    }
}