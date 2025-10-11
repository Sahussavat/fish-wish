
export class LoopObj {
    private remaining_time : number = 0

    constructor(private callback : CallableFunction, private delay : number){}

    running_loop(loop = true){
        let do_loop = ()=>{
            let stop_loop = false
            this.remaining_time += 1
            if(this.remaining_time >= this.delay){
                this.remaining_time = 0
                this.callback()
                if(!loop){
                    stop_loop = true
                }
            }
            if(!stop_loop){
                requestAnimationFrame(do_loop)
            }
        }
        requestAnimationFrame(do_loop)
    }

    running_timeout(){
        this.running_loop(false)
    }

}