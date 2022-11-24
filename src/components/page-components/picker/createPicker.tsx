import {StoreValue, useStore} from "../../store/useStore";
import {useAfterInit} from "../utils/useAfterInit";
import {useAppContext} from "../../useAppContext";
import invariant from "tiny-invariant";
import {Picker} from "./Picker";
import {Button} from "../Button";
import {AiOutlineSelect} from "react-icons/ai";
import {ButtonTheme} from "../../../routes/Theme";
import {isNullOrUndefined} from "../utils/isNullOrUndefined";
import {useMemo} from "react";


const nothing = () => {
};

export interface PickerProperties<T> {
    dataProvider: T[],
    dataToLabel: (param?: T) => any,
    valueToData: (value: any, data: T) => boolean,
    dataToValue: (data: T) => any
}

export interface ValueOnChangeProperties<T> {
    value?: any,
    onChange?: (value: T) => void
}

export function createPicker<T>(props: PickerProperties<T>) {
    let {dataProvider, dataToLabel, valueToData, dataToValue} = props;
    dataProvider = dataProvider ?? [];
    dataToLabel = dataToLabel ?? nothing;
    valueToData = valueToData ?? nothing;
    dataToValue = dataToValue ?? nothing;
    return function InputPicker(props: ValueOnChangeProperties<T>) {
        let {value, onChange} = props;
        const data = useMemo(() => dataProvider.find((data) => valueToData(value, data)), [value]);

        onChange = onChange ?? nothing;

        const store = useStore(data);
        useAfterInit(() => {
            store.setState(data);
        }, [data, store]);

        const {appDimension} = useAppContext();
        return <div style={{
            display: 'flex', flexDirection: 'column',
            width: appDimension.width,
            backgroundColor: 'white',
            borderTopRightRadius:20,borderTopLeftRadius:20
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

