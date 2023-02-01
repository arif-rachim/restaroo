import {IoClose} from "react-icons/io5";
import {Button} from "../page";
import {useAppContext} from "../../app";
import {ButtonTheme, red} from "../Theme";

export function useErrorWrapper() {
    const {showModal} = useAppContext();
    return function invoker<T>(callback: (event: T) => Promise<any>) {
        return async function invoker(event: T) {
            try {
                return await callback(event);
            } catch (err: any) {
                await showModal(closePanel => {
                    return <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 10,
                        background: red,
                        color: 'white',
                        borderRadius: 10
                    }}>
                        <div>{err.message}</div>
                        <div style={{display: 'flex', flexDirection: 'row-reverse', marginTop: 5}}>
                            <Button onTap={() => {
                                closePanel(true);
                            }} title={'Ok'} icon={IoClose} theme={ButtonTheme.danger}
                                    style={{color: 'white', fontSize: 13, padding: '5px 10px'}}
                                    iconStyle={{width: 13, height: 13}}/>
                        </div>
                    </div>
                });
            }
        }
    }
}