import {RouteProps} from "@restaroo/lib";
import {useEffect} from "react";
import {pocketBase} from "../service";
import {schema} from "@restaroo/mdl";


const pb = pocketBase;

export function CollectionRoute(route:RouteProps){
    const collection = route.params.get('collection') ?? '';
    console.log(schema.filter((f:any) => f.name === collection));
    useEffect(() => {
        (async() => {
            const pageResult = await pb.collection(collection).getFirstListItem('');


        })();
    },[])
    return <div>
        <h1>{collection}</h1>
    </div>
}