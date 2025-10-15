
import { Constant } from "../app/ts/constant"
import { Data, GoogleSheetJSON, TableData } from "../app/ts/googlesheetjson"

const data_table = [
        ["1760186541", "Alex123", "1สุขสันต์วันสงกรานต์น้า1", "3"],
        ["1760186517", "bobby123", "2สุขสันต์วันปีใหม่น้า2", "0"],
        ["1759172885", "ใจกล้า", "3สุขสันต์วันสงกรานต์น้า3", "2"],
    ]

const first_row = [
    ['ประทับวันที่', 'ชื่อผู้ส่ง', 'คำอวยพร', 'ภาพที่']
]

export function create_first_row_json(){
    return create_mock_data_json(first_row)
}

export function create_mock_data_json(d_table = data_table){
    let ret : TableData = {
        "table" : {
            "rows": [

            ]
        }
    }

    let data_table_with_str = add_string_front(d_table)

    for(let i=0;i<data_table_with_str.length;i++){
        let c = []
        for(let j=0;j<data_table_with_str[i].length;j++){
            c.push({"v": data_table_with_str[i][j]})
        }
        ret['table']['rows'].push({ "c" : c })
    }

    return ret
}

export function create_result(){
    let ret : Data[] = []
    for(let i=0;i<data_table.length;i++){
        let row : Data = {}
        for(let j=0;j<data_table[i].length;j++){
            row[first_row[0][j]] = data_table[i][j]
        }
        ret.push(row)
        
    }
    return ret
}

export function to_google_format_res(str : string){
    return `google.visualization.Query.setResponse(${str});`
}

function add_string_front(arr : string[][]){
    let ret : string[][] = []
    for(let i=0;i<arr.length;i++){
        let row : string[] = []
        for(let j=0;j<arr[i].length;j++){
            row.push( "string:string:" + arr[i][j] )
        }
        ret.push(row)
    }
    return ret
}

let switch_res = 0

function custom_fetch(){
    switch (switch_res){
        case 0:
            switch_res = 1
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

describe('GoogleSheetJson', () => {

    beforeAll(()=>{
        globalThis.fetch = custom_fetch
    })

    it('should return all results in the same order', async() => {
        const parse = new GoogleSheetJSON(Constant.SHEET_ID, {
            "sheetName": Constant.SHEET_NAME
        })
        await parse.parse().then((d)=>{
            let expect_result = create_result()
            for(let i=0;i<d.length;i++){
                let f_r = first_row[0]
                for(let k =0;k<f_r.length;k++){
                    expect(d[i][f_r[k]]).toBe(expect_result[i][f_r[k]])
                }
            }
        })
    });
});
