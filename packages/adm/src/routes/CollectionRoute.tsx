import {RouteProps} from "@restaroo/lib";
import {useEffect} from "react";
import {pocketBase} from "../service";
const pb = pocketBase;

export function CollectionRoute(route:RouteProps){
    const collection = route.params.get('collection') ?? '';
    useEffect(() => {
        (async() => {
            const pageResult = await pb.collection(collection).getFirstListItem('');
            debugger;
        })();
    },[])
    return <div>
        <h1>{collection}</h1>
    </div>
}