interface Option {
    sheetName?: string,
    start?: number,
    end?: number,
}
export interface Data {
    [key :string]: string
}
interface V {
    'v': string
}
interface C {
    'c': Array<V>
}
interface RowData {
    'rows': Array<C>
}
export interface TableData {
    'table': RowData
}

export interface OptionLoadData {
    sheet_name : string,
    count_col : string,
}

export class GoogleSheetJSON {
    

    constructor(private gid : string, private  option : Option, private s_str = "H", private e_str = "K"){    }

    async get_data(start : number = 1, end : number = 1){
        try{
            let url = `https://docs.google.com/spreadsheets/d/${this.gid}/gviz/tq?`
            url += this.option['sheetName'] ? `sheet=${this.option['sheetName']}` : `gid=${this.gid}`
            url += `&range=${this.s_str+start}:${this.e_str+end}`
            const  data = await fetch(url)
            if (data && data.ok){
                let data_str : string = await data.text()
                let rex = /google\.visualization\.Query\.setResponse\(({.*})\);/
                const payload = data_str.match(rex)
                let json_data : TableData
                if (payload && payload.length > 0){
                    json_data = JSON.parse(payload[1])
                    let ret : Array<V[]> = []
                    let rows = json_data['table']['rows']
                    for(let i=0;i<rows.length;i++){
                        ret.push(rows[i]['c'])
                    }
                    return ret
                }
            }
        } catch(e){
            console.log(e)
        }
        return []
    }

    async parse(){
        let ret : Array<Data> = []
        let start = this.option.start ? this.option.start + 1 : 2
        let end = this.option.end ? this.option.end + 1 : 2
        let f_r = await this.get_data()
        let first_row : V[] = f_r[0]
        let data_rows = await this.get_data(start, end)
        for(let i=0;i<data_rows.length;i++){
            let data : V[] = data_rows[i]
            let d : Data = {}
            for(let k =0;k<Object.keys(first_row).length;k++){
                d[(first_row[k]['v']+"").replaceAll("string:","").replaceAll(" ","")] = (data[k]['v']+"").replaceAll("string:","")
            }
            ret.push(d)
        }
        return ret
    }

    static load_data(sheet_id : string, start_n_end_fn : CallableFunction, option : OptionLoadData){
        let test = new GoogleSheetJSON(sheet_id, {
            'sheetName': option.sheet_name,
        }, option.count_col, option.count_col).parse().then((d)=>{
            let n : number = parseInt(d[0]['count'])
            return n
        })
        .then((n)=>{
          if(!n){
            return []
          }
          let [ start, end ] = start_n_end_fn(n)
          return new GoogleSheetJSON(sheet_id, {
                'sheetName': option.sheet_name,
                'start': start,
                'end': end
          }).parse()
        })
      return test
    }
}