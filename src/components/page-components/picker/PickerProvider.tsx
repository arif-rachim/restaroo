import {useAppContext} from "../../useAppContext";
import {DatePicker} from "./DatePicker";
import {useImperativeHandle, forwardRef, ForwardedRef} from "react";
import {useStore, StoreValue, useStoreValue} from "../../store/useStore";
import {motion} from "framer-motion";

export type PickerOptions = 'date' | 'time';
export type ShowPickerFunction = (control: PickerOptions, value: any) => Promise<any>;

const owner = (match: PickerOptions, control?: PickerOptions, param?: any) => {
    return control === match ? param : undefined
}
const NO_PICKER = {control: undefined, value: undefined, onChange: undefined};

export const PickerProvider = forwardRef(function PickerProvider(props, ref: ForwardedRef<{ showPicker: ShowPickerFunction }>) {
    const store = useStore<{ control?: PickerOptions, value?: any, onChange?: (param: any) => void }>(NO_PICKER);

    const {appDimension} = useAppContext();

    useImperativeHandle(ref, () => {
        const showPicker: ShowPickerFunction = (control: PickerOptions, value: any) => {
            return new Promise(resolve => {
                const onClose = (value: any) => {
                    store.setState(NO_PICKER);
                    resolve(value);
                }
                store.setState({control, value, onChange: onClose})
            })
        }
        return {showPicker}
    }, []);
    const show = useStoreValue(store, param => param.control !== undefined)
    return <motion.div style={{
        height: '100%',
        position: 'absolute',
        top: 0,
        width: appDimension.width,
        overflow: 'hidden'
    }}
                       initial={{zIndex: -1, backgroundColor: 'rgba(0,0,0,0)'}}
                       animate={{
                           backgroundColor: show ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)',
                           zIndex: show ? 0 : -1
                       }}>
        <motion.div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute'
        }} initial={{bottom: '-100%'}} animate={{bottom: show ? 0 : '-100%'}}>
            <StoreValue store={store} property={['value', 'onChange']} selector={[
                s => owner('date', s.control, s.value),
                s => owner('date', s.control, s.onChange),
            ]}>
                <DatePicker/>
            </StoreValue>
        </motion.div>
    </motion.div>
})
