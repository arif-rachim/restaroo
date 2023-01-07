import {RouteProps, useNavigate} from "@restaroo/lib";
import {useEffect} from "react";
import {pocketBase} from "../service";

export function Collection(props:RouteProps){
    const catalog = props.params.get('collection');
    const navigate = useNavigate();
    useEffect(() => {
        if(!catalog){
            return;
        }
        (async () => {
            try{
                const collection = await pocketBase.collections.getOne(catalog);
            }catch(err:any){
                const {status,data:{message}} = err;
                if(status === 401){
                    navigate('/login');
                    // here we need to tell that this shit require status
                }
            }
        })();
    },[catalog]);
    return <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
        <div>
            <div style={{fontSize:16}}>Catalog Header</div>
        </div>
        <div style={{height:'100%',overflow:'auto'}}>
            Body
        </div>


    </div>
}