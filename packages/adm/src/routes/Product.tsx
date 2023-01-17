import {RouteProps, useAppContext, useFocusListenerAfterInit, useStore} from "@restaroo/lib";
import {useEffect} from "react";
import {pocketBase} from "../service";
import {Collection, ListResult} from "pocketbase";
const pb = pocketBase;

interface ProductType{
    collectionId:string;//"yhpvaelfn8drtze"
    collectionName:string;//"product"
    configs:string[]//(2) ['4csvrqtu9xfznf8', 'a8q1k5mygcibpxq']
    created:string;//"2023-01-06 07:34:13.383Z"
    currency:string;//"AED"
    description:string;//"Sample Product"
    discount:number;//10
    expand:any;//{}
    id:string;//"iyhof3x8fmligys"
    image:string;//""
    isVegan:boolean;////false
    name:string;//"Sample One"
    price:number;//23
    servesFor:number;//4
    updated:string;//"2023-01-06 07:34:13.383Z"
}

export function Product(props:RouteProps){

    const context = useAppContext();
    const dataStore = useStore<ListResult<{}>>({
        page : 1,
        perPage : 50,
        totalItems : 0,
        totalPages : 0,
        items : []
    })
    useEffect(() => {
        (async () => {
            const collectionListResult:ListResult<Collection> = await pb.collections.getList(1, 100);

            const resultList:ListResult<{}> = await pb.collection('product').getList(1, 50);

        })();
    },[]);
    useFocusListenerAfterInit(props.path,async() => {
        const resultList = await pb.collection('product').getList(1, 50);
        debugger;
    })
    return <div>
        Product Management
    </div>
}