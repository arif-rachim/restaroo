import {RouteProps,} from "@restaroo/lib";
import {Grid} from "../components/grid/Grid";

export function CollectionRoute(route: RouteProps) {
    return <Grid collection={route.params.get('collection') ?? ''}/>;
}