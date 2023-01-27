import {RouteProps,} from "@restaroo/lib";
import {CollectionGridPanel} from "../components/CollectionGridPanel";

export function CollectionRoute(route: RouteProps) {
    return <CollectionGridPanel collection={route.params.get('collection') ?? ''}/>;
}