import {StoreValue, useStore} from "../../store/useStore";
import {useAfterInit} from "../useAfterInit";
import {useAppContext} from "../../useAppContext";
import {Picker} from "./Picker";
import {Button} from "../Button";
import {IoCalendar} from "react-icons/io5";
import {ButtonTheme} from "../../../routes/Theme";

const defaultDate = new Date();
const nothing = () => {};

function toTimeFormat(value: Date) {
    const hours = value.getHours();
    const minutes = value.getMinutes();
    return {hours,minutes};
}


function toDateFormat(props: { hours: number, minutes:number,date?:Date }) {
    const date = props.date ?? new Date();
    const newDate = new Date(date.getTime());
    newDate.setHours(props.hours,props.minutes,0,0);
    return newDate;
}

export function TimePicker(props:{ value?: Date, onChange?: (value: Date) => void }){
    const value = props.value ?? defaultDate;
    const onChange = props.onChange ?? nothing;

    const store = useStore(() => toTimeFormat(value));
    useAfterInit(() => {
        const newState = toTimeFormat(value);
        store.setState(newState);
    }, [value, store]);


    const {appDimension} = useAppContext();
    return <div style={{
        display: 'flex', flexDirection: 'column',
        width: appDimension.width,
        backgroundColor: 'white'
    }}>

        <div style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <StoreValue store={store} property={'value'} selector={s => s.hours}>
                <Picker width={70}
                        data={Array.from({length: 24}).map((_, index) => ({key: index, value: `${(index + 1).toString().padStart(2,'0')}`}))}
                        onChange={day => store.setState(old => ({...old, day}))}
                />
            </StoreValue>
            <StoreValue store={store} property={'value'} selector={s => s.minutes}>
                <Picker data={Array.from({length: 60}).map((_, index) => ({key: index, value: `${(index + 1).toString().padStart(2,'0') }`}))}
                        onChange={month => store.setState(old => ({...old, month}))}
                />
            </StoreValue>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
            <Button title={'OK'} onTap={() => onChange(toDateFormat(store.stateRef.current))} icon={IoCalendar}
                    theme={ButtonTheme.promoted}/>
        </div>
    </div>
}