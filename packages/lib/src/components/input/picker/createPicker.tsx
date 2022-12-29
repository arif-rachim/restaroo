import {StoreValue, useStore} from "../../utils/useStore";
import {useAfterInit} from "../../utils/useAfterInit";
import invariant from "tiny-invariant";
import {Picker} from "./Picker";
import {Button} from "../../page/Button";
import {AiOutlineSelect} from "react-icons/ai";
import {ButtonTheme} from "../../Theme";
import {isNullOrUndefined} from "../../utils/isNullOrUndefined";
import {useMemo} from "react";
import {useAppDimension} from "../../utils";
import noNull from "../../utils/noNull";


const nothing = () => {
};

export interface PickerProperties<T> {
    dataProvider: T[],
    dataToLabel: (param?: T) => any,
    valueToData: (value: any, data: T) => any,
    dataToValue: (data: T) => any
}

export interface ValueOnChangeProperties<T> {
    value?: any,
    onChange?: (value: T) => void
}

export function createPicker<T>(props: PickerProperties<T>) {
    let {dataProvider, dataToLabel, valueToData, dataToValue} = props;
    dataProvider = noNull(dataProvider, []);
    dataToLabel = noNull(dataToLabel, nothing);
    valueToData = noNull(valueToData, nothing);
    dataToValue = noNull(dataToValue, nothing);
    return function InputPicker(props: ValueOnChangeProperties<T>) {
        let {value, onChange} = props;
        const data = useMemo(() => dataProvider.find((data) => valueToData(value, data)), [value]);

        onChange = noNull(onChange, nothing);

        const store = useStore(data);
        useAfterInit(() => {
            store.setState(data);
        }, [data, store]);

        const {appDimension} = useAppDimension();
        return <div style={{
            display: 'flex', flexDirection: 'column',
            width: appDimension.width,
            backgroundColor: 'white',
            borderTopRightRadius: 20, borderTopLeftRadius: 20
        }}>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
            }}>
                <StoreValue store={store} property={'value'} selector={s => {
                    if (isNullOrUndefined(s)) {
                        return -1;
                    }
                    invariant(s);
                    return dataProvider.indexOf(s);
                }}>
                    <Picker data={dataProvider.map((data, index) => ({key: index, value: dataToLabel(data)}))}
                            onChange={index => store.setState(dataProvider[index])} fontSize={20} width={'100%'}
                    />
                </StoreValue>

                <div style={{
                    position: 'absolute',
                    width: '100%',
                    top: 150,
                    height: 50,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                }}/>

            </div>

            <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
                <Button title={'Continue'} onTap={() => {
                    invariant(store.stateRef.current);
                    invariant(onChange)
                    onChange(dataToValue(store.stateRef.current))
                }} icon={AiOutlineSelect}
                        theme={ButtonTheme.promoted}/>
            </div>
        </div>
    }
}

