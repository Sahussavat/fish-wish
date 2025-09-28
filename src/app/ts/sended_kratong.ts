
export interface kratong_data {
    sender_name: string,
    kratong_des: string,
    kratong_pic_i: number
}

export class SendedKratong {
    private static instance: SendedKratong | null = null;
    private data : kratong_data | null = null
    private constructor() { }

    public static getInstance(): SendedKratong {
        if (this.instance === null) {
            this.instance = new SendedKratong();
        }
        return this.instance;
    }

    public set_kratong(k_d : kratong_data) {
        this.data = k_d;
    }

    public get_kratong(){
        let sending_temp = this.data
        this.data = null
        return sending_temp
    }

    public is_have_data(){
        return this.data !== null
    }
}
