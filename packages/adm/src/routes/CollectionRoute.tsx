import {ButtonTheme, RouteProps} from "@restaroo/lib";
import {useEffect} from "react";
import {pocketBase} from "../service";
import {tables} from "@restaroo/mdl";
import {DButton} from "../components/DButton";
import {IoAdd} from "react-icons/io5";

const pb = pocketBase;

export function CollectionRoute(route:RouteProps){
    const collection = route.params.get('collection') ?? '';
    const collectionId = route.params.get('id') ?? '';
    const table = tables.find(f => f.name === collection);

    useEffect(() => {
        (async() => {
            const pageResult = await pb.collection(collection).getFirstListItem('');

        })();
    },[])
    return <div>
        <DButton onTap={() => {
            
        }} title={'Click'} icon={IoAdd} theme={ButtonTheme.danger} />
    </div>
}