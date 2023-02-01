import {DatePicker} from "./DatePicker";
import {ForwardedRef, forwardRef, memo, PropsWithChildren, useImperativeHandle, useMemo} from "react";
import {getProp, StoreValue, useAppDimension, useStore, useStoreValue} from "../../utils";
import {motion} from "framer-motion";
import {TimePicker} from "./TimePicker";
import invariant from "tiny-invariant";
import {createPicker, PickerProperties, ValueOnChangeProperties} from "./createPicker";
import {Country, countryList} from "./dataprovider/CountryList";
import {Gender, genderList} from "./dataprovider/GenderList";
import {IoMdCloseCircle} from "react-icons/io";


export type ShowPickerFunction = (control: PickerOptions, value: any) => Promise<any>;

const owner = (match: PickerOptions, control?: PickerOptions, param?: any) => {
    if (typeof control === 'string') {
        return control === match ? param : undefined
    } else if (typeof control === 'object' && match as string === 'custom') {
        return param
    }
}

const NO_PICKER = {control: undefined, value: undefined, onChange: undefined};

const CountryPicker = createPicker<Country>({
    dataProvider: countryList,
    dataToLabel: s => `${getProp(s, 'name')} (${getProp(s, 'dial_code')})`,
    dataToValue: s => s.dial_code,
    isValueBelongsToData: (value, data) => data.dial_code === value
});

const GenderPicker = createPicker<Gender>({
    dataProvider: genderList,
    dataToLabel: s => `${getProp(s, 'name')}`,
    dataToValue: d => d.name,
    isValueBelongsToData: (value, data) => data.name === value
});

export const PickerMap = {
    date: memo(DatePicker),
    time: memo(TimePicker),
    country: memo(CountryPicker),
    gender: memo(GenderPicker)
}

const CustomPickerComponent = memo(function CustomPickerComponent(props: (ValueOnChangeProperties<any> & PickerProperties<any>)) {
    let {value, onChange, dataToValue, dataToLabel, isValueBelongsToData, dataProvider} = props;
    const InputPicker = useMemo(() => createPicker({
        dataProvider,
        dataToLabel,
        isValueBelongsToData,
        dataToValue
    }), [dataProvider, dataToLabel, isValueBelongsToData, dataToValue]);
    return <InputPicker onChange={onChange} value={value}/>
})

export type PickerOptions = keyof typeof PickerMap | PickerProperties<any>;

export const PickerProvider = forwardRef(function PickerProvider(props, ref: ForwardedRef<{ showPicker: ShowPickerFunction }>) {
    const store = useStore<{ control?: PickerOptions, value?: any, onChange?: (param: any) => void }>(NO_PICKER);
    const {appDimension} = useAppDimension();
    useImperativeHandle(ref, () => {
        const showPicker: ShowPickerFunction = (control: PickerOptions, value: any) => {
            return new Promise(resolve => {
                const onClose = (value: any) => {
                    store.set(NO_PICKER);
                    resolve(value);
                }
                store.set({control, value, onChange: onClose})
            })
        }
        return {showPicker}
    }, [store]);
    const show = useStoreValue(store, param => param.control !== undefined)

    function close() {
        const current = store.get();
        invariant(current.onChange);
        current.onChange(current.value);
    }

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
        {Object.keys(PickerMap).concat('custom').map((key) => {
            let Picker = CustomPickerComponent as any;
            if (key in PickerMap) {
                Picker = (PickerMap as any)[key];
            }
            return <StoreValue store={store} property={'show'} selector={s => {
                const result = (typeof s.control === 'string' ? s.control === key : key === 'custom' && s.control !== undefined);
                return result;
            }} key={key}>
                <PickerContainer show={false} onClose={() => {
                    close();
                }}>
                    <StoreValue store={store}
                                property={['value', 'onChange', 'dataProvider', 'dataToLabel', 'isValueBelongsToData', 'dataToValue']}
                                selector={s => {
                                    return [
                                        owner(key as PickerOptions, s.control, s.value),
                                        owner(key as PickerOptions, s.control, s.onChange),
                                        owner(key as PickerOptions, s.control, typeof s.control === 'object' && 'dataProvider' in s.control ? s.control.dataProvider : undefined),
                                        owner(key as PickerOptions, s.control, typeof s.control === 'object' && 'dataToLabel' in s.control ? s.control.dataToLabel : undefined),
                                        owner(key as PickerOptions, s.control, typeof s.control === 'object' && 'isValueBelongsToData' in s.control ? s.control.isValueBelongsToData : undefined),
                                        owner(key as PickerOptions, s.control, typeof s.control === 'object' && 'dataToValue' in s.control ? s.control.dataToValue : undefined)
                                    ]
                                }}>
                        <Picker/>
                    </StoreValue>
                </PickerContainer>
            </StoreValue>
        })}
    </motion.div>
})

function PickerContainer(props: PropsWithChildren<{ show: boolean, onClose: () => void }>) {
    const {show, onClose} = props;
    return <motion.div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        position: 'absolute'
    }} initial={{bottom: '-100%'}} animate={{bottom: show ? 0 : '-100%'}} transition={{bounce: 0}}>
        <div style={{position: 'relative', top: -20}}>
            <IoMdCloseCircle style={{fontSize: 40, color: 'white'}} onClick={() => {
                onClose();
            }}/>
        </div>
        {props.children}
    </motion.div>
}